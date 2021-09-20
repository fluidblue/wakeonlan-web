import { Host, IPFunctions, IPNetwork, SettingsData } from "wakeonlan-utilities";

interface HostMacIP {
  ip: string;
  mac: string;
}

export default class API {
  private static readonly apiUri = this.getAPIUri();

  private constructor() {}

  private static getAPIUri() {
    let uri = '/api';
    if (process.env.NODE_ENV === 'development') {
      uri = window.location.protocol + '//' + window.location.hostname + ':8000' + uri;
    }
    return uri;
  }

  static async fetchHostname(ip: string): Promise<string> {
    const response = await fetch(API.apiUri + '/device-name/host-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ip: ip
      })
    });
    if (response.ok) {
      return await response.text();
    } else {
      return ip;
    }
  }

  static async hostDiscovery(ipNetwork: IPNetwork): Promise<Host[]> {
    const response = await fetch(API.apiUri + '/host-discovery/arp-scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'ip-network': IPFunctions.getStringFromIPNetwork(ipNetwork)
      })
    });
    const rawData = await response.text();
    let data: Host[] = [];
    for (let line of rawData.split('\n')) {
      line = line.trim();
      if (line.length === 0) {
        continue;
      }
      const resultObject = JSON.parse(line);
      if (resultObject.result === false) {
        data = [];
        break;
      }
      const hostMacIp: HostMacIP = resultObject;
  
      const host: Host = {
        name: await API.fetchHostname(hostMacIp.ip),
        mac: hostMacIp.mac
      };
      data.push(host);
    }
    return data;
  }

  static async addHost(host: Host) {
    let response;
    try {
      response = await fetch(API.apiUri + '/savedhosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(host)
      });
    } catch (err) {
      return false;
    }
    if (!response.ok) {
      return false;
    }
    const result = await response.json();
    if (!result || result.result !== true) {
      return false;
    }
    return true;
  }

  static async removeHost(mac: string): Promise<boolean> {
    let response;
    try {
      response = await fetch(API.apiUri + '/savedhosts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mac: mac
        })
      });
    } catch (err) {
      return false;
    }
    if (!response.ok) {
      return false;
    }
    const result = await response.json();
    if (!result || result.result !== true) {
      return false;
    }
    return true;
  }

  static async wakeonlan(mac: string, port: number): Promise<boolean> {
    let response;
    try {
      response = await fetch(API.apiUri + '/wakeonlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mac: mac,
          port: port
        })
      });
    } catch (err) {
      return false;
    }
    if (!response.ok) {
      return false;
    }
    const responseObject = await response.json();
    if (!responseObject || !responseObject.result || responseObject.result !== true) {
      return false;
    }
    return true;
  }

  static async settingsSave(settings: SettingsData) {
    const uri = API.apiUri + '/settings';
    let response;
    try {
      response = await fetch(uri, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
    } catch (err) {
      return false;
    }
    if (!response.ok || !response.body) {
      throw new Error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
    }
    const res = await response.json();
    if (!res || res.result !== true) {
      return false;
    }
    return true;
  }

  static async ipNetworksLoad() {
    const uri = API.apiUri + '/ip-networks';
    const response = await fetch(uri, {
      method: 'GET'
    });
    if (!response.ok || !response.body) {
      throw new Error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
    }
    const rawData: string[] = await response.json();
    let data: IPNetwork[] = [];
    try {
      data = rawData.map((network) => {
        return IPFunctions.getIPNetworkFromString(network);
      });
    } catch (err) {
      throw new Error('Could not parse data of ' + uri + ' (' + err + ')');
    }
    return data;
  };

  static async settingsLoad() {
    const uri = API.apiUri + '/settings';
    const response = await fetch(uri, {
      method: 'GET'
    });
    if (!response.ok || !response.body) {
      throw new Error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
    }
    return await response.json();
  }
}

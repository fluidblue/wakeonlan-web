import React, { useCallback, useEffect, useState } from 'react';
import './Settings.css';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';

function ipNetworksToString(ipNetworks: IPNetwork[]): string {
  const ipNetworkStrings = ipNetworks.map((value) => {
    return IPFunctions.getStringFromIPNetwork(value);
  });
  return ipNetworkStrings.join(', ');
}

const WAKEONLAN_DEFAULT_PORT: number = 9;

function Settings() {
  const [ipNetworks, setIpNetworks] = useState<IPNetwork[]>([]);
  const [ipNetworksAutoDetected, setIpNetworksAutoDetected] = useState<IPNetwork[]>([]);

  const [ipNetworksString, setIpNetworksString] = useState<string>("");
  const [autoDetectNetworks, setAutoDetectNetworks] = useState<boolean>(true);
  const [wolPort, setWolPort] = useState<number>(WAKEONLAN_DEFAULT_PORT);

  useEffect(() => {
    // TODO: Fetch IP networks from server
    const ipNetworksAutoDetectedMock: IPNetwork[] = [
      { ip: "192.168.178.0", prefix: 24 },
      { ip: "192.168.188.0", prefix: 24 }
    ];
    setIpNetworksAutoDetected(ipNetworksAutoDetectedMock);
  }, []);

  const resetIpNetworks = useCallback(() => {
    setIpNetworks(ipNetworksAutoDetected);
    setIpNetworksString(ipNetworksToString(ipNetworksAutoDetected));
  }, [ipNetworksAutoDetected]);

  useEffect(() => {
    resetIpNetworks();
  }, [resetIpNetworks]);

  function setIpNetworkAutoDetection(value: boolean) {
    if (value) {
      setIpNetworks(ipNetworksAutoDetected);
      setIpNetworksString(ipNetworksToString(ipNetworksAutoDetected));
      setAutoDetectNetworks(true);
    } else {
      setAutoDetectNetworks(false);
    }
  }

  function onCheckboxAutoDetectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIpNetworkAutoDetection(e.target.checked);
  }

  function updateIpNetworks() {
    let valid: boolean = true;
    const ipNetworkStrings: string[] = ipNetworksString.split(',');
    const ipNetworksNew: IPNetwork[] = [];
    for (let ipNetworkString of ipNetworkStrings) {
      ipNetworkString = ipNetworkString.trim();
      let ipNetwork: IPNetwork;
      try {
        ipNetwork = IPFunctions.getIPNetworkFromString(ipNetworkString);
      } catch (err) {
        valid = false;
        break;
      }
      ipNetworksNew.push(ipNetwork);
    }
    if (valid) {
      setIpNetworks(ipNetworksNew);
      console.log('valid, setIpNetworks', ipNetworksNew); // TODO: Remove
    }
    if (!valid) {
      console.log('invalid', ipNetworksString); // TODO: Remove
    }
  }

  function onInputNetworkChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIpNetworksString(e.target.value);
  }

  function onInputPortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      // TODO: Set form invalid
    } else {
      setWolPort(value);
    }
  }

  function onSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // TODO
    updateIpNetworks();
  }

  function onReset() {
    setIpNetworkAutoDetection(true);
    setWolPort(WAKEONLAN_DEFAULT_PORT);
  }

  return (
    <div className="settings">
      <form>
        <h6 className="mb-3 fw-bold">Host discovery</h6>
        <div className="mb-3">
          <label htmlFor="inputNetwork" className="form-label">IP network</label>
          <input
            type="text"
            className="form-control"
            id="inputNetwork"
            value={ipNetworksString}
            placeholder="Enter network, e.g. 192.168.178.0/24"
            required
            onChange={onInputNetworkChange}
            disabled={autoDetectNetworks}
          />
        </div>
        <div className="mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="checkboxAutoDetect"
            checked={autoDetectNetworks}
            onChange={onCheckboxAutoDetectChange}
          />
          &nbsp;
          <label className="form-check-label checkbox-fix" htmlFor="checkboxAutoDetect">Automatically detect network</label>
        </div>
        {/* <div className="mb-3">
          <label htmlFor="selectMethod" className="form-label">Method</label>
          <select className="form-select" id="selectMethod">
            <option value="arp-scan" selected>arp-scan</option>
            <option value="arp-cache-and-ping">ARP cache and ping</option>
          </select>
        </div> */}
        <h6 className="mb-3 fw-bold">Wake on LAN</h6>
        <div className="mb-3">
          <label htmlFor="inputPort" className="form-label">UDP Port</label>
          <input
            type="number"
            className="form-control"
            id="inputPort"
            placeholder="Enter port number"
            value={wolPort}
            onChange={onInputPortChange}
            required
          />
        </div>
        <hr />
        <div className="mb-3">
          <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
          <button type="submit" className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default Settings;

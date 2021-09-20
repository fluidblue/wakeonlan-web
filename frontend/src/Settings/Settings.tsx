import React, { useEffect, useState } from 'react';
import './Settings.css';

import IPNetworkPanel from './IPNetworkPanel';
import { IPNetwork } from 'wakeonlan-utilities';
import { isIpNetworksStringValid, stringToIpNetworks } from '../IPUtilities';

const WAKEONLAN_DEFAULT_PORT: number = 9;
const PORT_MIN: number = 0;
const PORT_MAX: number = 65535;

export interface SettingsData {
	autoDetectNetworks: boolean;
	ipNetworks: IPNetwork[];
	wolPort: number;
}

export const settingsDataDefault: SettingsData = {
	autoDetectNetworks: true,
	ipNetworks: [],
	wolPort: 9
};

function save(settings: SettingsData) {
  // TODO: Save to server
  console.log('wolPort', settings.wolPort);
  console.log('autoDetectNetworks', settings.autoDetectNetworks);
  console.log('ipNetworks', settings.ipNetworks);
}

interface SettingsProps {
  autoDetectedNetworks: IPNetwork[];

  settings: SettingsData;
  onSettingsChange: React.Dispatch<React.SetStateAction<SettingsData>>;
}

function Settings(props: SettingsProps) {
  const [networksString, setNetworksString] = useState<string>('');

  const [autoDetectNetworks, setAutoDetectNetworks] = useState<boolean>(true);
  const [ipNetworks, setIpNetworks] = useState<IPNetwork[]>([]);
  const [wolPort, setWolPort] = useState<number>(WAKEONLAN_DEFAULT_PORT);

  const [wasValidated, setWasValidated] = useState(false);

  const { settings } = props;
  useEffect(() => {
    setAutoDetectNetworks(settings.autoDetectNetworks);
    setIpNetworks(settings.ipNetworks);
    setWolPort(settings.wolPort);
  }, [settings]);

  function onInputPortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setWolPort(value);
  }

  function onSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (wolPort < PORT_MIN || wolPort > PORT_MAX) {
      setWasValidated(true);
      return;
    }

    let ipNetworksNew: IPNetwork[] = [];
    if (!autoDetectNetworks) {
      if (!isIpNetworksStringValid(networksString)) {
        setWasValidated(true);
        return;
      }
      ipNetworksNew = stringToIpNetworks(networksString);
      setIpNetworks(ipNetworksNew);
    }

    setWasValidated(false);

    const settingsNew: SettingsData = {
      autoDetectNetworks: autoDetectNetworks,
      ipNetworks: ipNetworksNew,
      wolPort: wolPort
    }
    props.onSettingsChange(settingsNew);
    save(settingsNew);
  }

  function onReset() {
    setWasValidated(false);

    setAutoDetectNetworks(true);
    setWolPort(WAKEONLAN_DEFAULT_PORT);
  }

  const formClassName = wasValidated ? 'was-validated' : '';

  return (
    <div className="settings">
      <form className={formClassName}>
        <h6 className="mb-3 fw-bold">Host discovery</h6>
        <IPNetworkPanel
          autoDetectedNetworks={props.autoDetectedNetworks}
          ipNetworks={ipNetworks}
          onIpNetworksChange={setIpNetworks}
          autoDetect={autoDetectNetworks}
          onAutoDetectChange={setAutoDetectNetworks}
          networks={networksString}
          onNetworksChange={setNetworksString}
          wasValidated={wasValidated}
        />
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
            min={PORT_MIN}
            max={PORT_MAX}
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

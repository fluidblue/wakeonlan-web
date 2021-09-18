import React, { useState } from 'react';
import './Settings.css';

import IPNetworkPanel from './IPNetworkPanel';
import { IPNetwork } from 'wakeonlan-utilities';
import { isIpNetworksStringValid, stringToIpNetworks } from '../IPUtilities';
import { WAKEONLAN_DEFAULT_PORT } from '../App';

const PORT_MIN: number = 0;
const PORT_MAX: number = 65535;

interface SettingsProps {
  autoDetectedNetworks: IPNetwork[];

  ipNetworks: IPNetwork[];
  onIpNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>;

  autoDetectNetworks: boolean;
  onAutoDetectNetworksChange: React.Dispatch<React.SetStateAction<boolean>>;

  wolPort: number;
  onWolPortChange: React.Dispatch<React.SetStateAction<number>>;
}

function Settings(props: SettingsProps) {
  const [networksString, setNetworksString] = useState<string>('');

  const [wasValidated, setWasValidated] = useState(false);

  function onInputPortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    props.onWolPortChange(value);
  }

  function saveToServer(wolPort: number, autoDetectNetworks: boolean, ipNetworks: IPNetwork[]) {
    // TODO: Save to server
    console.log('wolPort', wolPort);
    console.log('autoDetectNetworks', autoDetectNetworks);
    console.log('ipNetworks', ipNetworks);
  }

  function onSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (props.wolPort < PORT_MIN || props.wolPort > PORT_MAX) {
      setWasValidated(true);
      return;
    }

    let ipNetworks: IPNetwork[] | null = null;
    if (props.autoDetectNetworks) {
      ipNetworks = props.autoDetectedNetworks;
    } else {
      if (!isIpNetworksStringValid(networksString)) {
        setWasValidated(true);
        return;
      }
      ipNetworks = stringToIpNetworks(networksString);
    }

    setWasValidated(false);
    props.onIpNetworksChange(ipNetworks);
    saveToServer(props.wolPort, props.autoDetectNetworks, ipNetworks);
  }

  function onReset() {
    setWasValidated(false);

    props.onAutoDetectNetworksChange(true);
    props.onWolPortChange(WAKEONLAN_DEFAULT_PORT);
  }

  const formClassName = wasValidated ? 'was-validated' : '';

  return (
    <div className="settings">
      <form className={formClassName}>
        <h6 className="mb-3 fw-bold">Host discovery</h6>
        <IPNetworkPanel
          autoDetectedNetworks={props.autoDetectedNetworks}
          autoDetect={props.autoDetectNetworks}
          onAutoDetectChange={props.onAutoDetectNetworksChange}
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
            value={props.wolPort}
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

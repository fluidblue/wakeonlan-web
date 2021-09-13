import React, { useState } from 'react';
import './Settings.css';

import IPNetworkPanel from './IPNetworkPanel';
import { IPNetwork } from 'wakeonlan-utilities';

const WAKEONLAN_DEFAULT_PORT: number = 9;

function Settings() {
  const [ipNetworks, setIpNetworks] = useState<IPNetwork[]>([]);
  const [autoDetectNetworks, setAutoDetectNetworks] = useState<boolean>(true);

  const [wolPort, setWolPort] = useState<number>(WAKEONLAN_DEFAULT_PORT);

  const [wasValidated, setWasValidated] = useState(false);

  function onInputPortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setWolPort(value);
  }

  function onSave(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setWasValidated(true);

    // TODO
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
          ipNetworks={ipNetworks}
          onIpNetworksChange={setIpNetworks}
          autoDetect={autoDetectNetworks}
          onAutoDetectChange={setAutoDetectNetworks}
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
            min={0}
            max={65535}
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

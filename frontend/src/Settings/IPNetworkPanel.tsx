import React, { useEffect } from 'react';

import { IPNetwork } from 'wakeonlan-utilities';
import { ipNetworksToString, isIpNetworksStringValid } from '../IPUtilities'

interface IPNetworkPanelProps {
  autoDetectedNetworks: IPNetwork[];

  ipNetworks: IPNetwork[];
  onIpNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>;

  autoDetect: boolean;
  onAutoDetectChange: React.Dispatch<React.SetStateAction<boolean>>;

  networks: string;
  onNetworksChange: React.Dispatch<React.SetStateAction<string>>;

  wasValidated: boolean;
}

function IPNetworkPanel(props: IPNetworkPanelProps) {
  const { ipNetworks, autoDetectedNetworks, autoDetect, onNetworksChange, onIpNetworksChange } = props;
  useEffect(() => {
    if (autoDetect) {
      onNetworksChange(ipNetworksToString(autoDetectedNetworks));
      onIpNetworksChange(autoDetectedNetworks);
    } else {
      onNetworksChange(ipNetworksToString(ipNetworks));
    }
  }, [ipNetworks, autoDetectedNetworks, autoDetect, onNetworksChange, onIpNetworksChange]);

  function onInputNetworkChange (e: React.ChangeEvent<HTMLInputElement>) {
    props.onNetworksChange(e.target.value);
  }

  function onCheckboxAutoDetectChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onAutoDetectChange(e.target.checked);
  }

  let inputNetworksClassName = 'form-control';
  if (props.wasValidated) {
    const inputNetworksValid = isIpNetworksStringValid(props.networks);
    if (!inputNetworksValid) {
      inputNetworksClassName += ' is-invalid';
    }
  }

  return (
    <>
      <div className="mb-3">
        <label htmlFor="inputNetwork" className="form-label">IP network</label>
        <input
          type="text"
          className={inputNetworksClassName}
          id="inputNetworks"
          value={props.networks}
          placeholder="Enter network, e.g. 192.168.178.0/24"
          onChange={onInputNetworkChange}
          disabled={props.autoDetect}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="checkboxAutoDetect"
          checked={props.autoDetect}
          onChange={onCheckboxAutoDetectChange}
        />
        &nbsp;
        <label className="form-check-label checkbox-fix" htmlFor="checkboxAutoDetect">Automatically detect network</label>
      </div>
    </>
  );
}

export default IPNetworkPanel;

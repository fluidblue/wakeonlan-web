import React, { useEffect, useState } from 'react';

import { IPNetwork } from 'wakeonlan-utilities';
import { ipNetworksToString } from './IPUtilities'

interface IPNetworkPanelProps {
  autoDetectedNetworks: IPNetwork[];

  autoDetect: boolean;
  onAutoDetectChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function IPNetworkPanel(props: IPNetworkPanelProps) {
  const [inputNetworks, setInputNetworks] = useState<string>('');

  // When the component is mounted, every time autoDetectedNetworks or inputAutoDetect changes,
  // update inputNetworks to match autoDetectedNetworks (but only if inputAutoDetect is true).
  const { autoDetectedNetworks, autoDetect } = props;
  useEffect(() => {
    if (autoDetect) {
      setInputNetworks(ipNetworksToString(autoDetectedNetworks));
    }
  }, [autoDetectedNetworks, autoDetect]);

  function onInputNetworkChange (e: React.ChangeEvent<HTMLInputElement>) {
    setInputNetworks(e.target.value);
  }

  function onCheckboxAutoDetectChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onAutoDetectChange(e.target.checked);
  }

  const inputNetworkInvalid: boolean = false;
  const inputNetworkClassName = inputNetworkInvalid ? 'form-control is-invalid' : 'form-control';

  return (
    <>
      <div className="mb-3">
        <label htmlFor="inputNetwork" className="form-label">IP network</label>
        <input
          type="text"
          className={inputNetworkClassName}
          id="inputNetwork"
          value={inputNetworks}
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

import React, { useCallback, useEffect, useState } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';

function ipNetworksToString(ipNetworks: IPNetwork[]): string {
  const ipNetworkStrings = ipNetworks.map((value) => {
    return IPFunctions.getStringFromIPNetwork(value);
  });
  return ipNetworkStrings.join(', ');
}

function stringToIpNetworks(value: string): IPNetwork[] {
  const ipNetworkStrings: string[] = value.split(',');
  const result: IPNetwork[] = [];
  for (let ipNetworkString of ipNetworkStrings) {
    ipNetworkString = ipNetworkString.trim();
    const ipNetwork = IPFunctions.getIPNetworkFromString(ipNetworkString);
    result.push(ipNetwork);
  }
  return result;
}

interface IPNetworkPanelProps {
  ipNetworks: IPNetwork[];
  onIpNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>;

  autoDetectNetworks: boolean;
  onAutoDetectNetworksChange: React.Dispatch<React.SetStateAction<boolean>>;

  wasValidated: boolean;
}

function IPNetworkPanel(props: IPNetworkPanelProps) {
  const [ipNetworksAutoDetected, setIpNetworksAutoDetected] = useState<IPNetwork[]>([]);
  const [ipNetworksString, setIpNetworksString] = useState<string>('');
  const [ipNetworksShowInvalid, setIpNetworksShowInvalid] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Fetch IP networks from server
    const ipNetworksAutoDetectedMock: IPNetwork[] = [
      { ip: "192.168.178.0", prefix: 24 },
      { ip: "192.168.188.0", prefix: 24 }
    ];
    setIpNetworksAutoDetected(ipNetworksAutoDetectedMock);
  }, []);

  const { autoDetectNetworks, onIpNetworksChange } = props;
  useEffect(() => {
    if (autoDetectNetworks) {
      onIpNetworksChange(ipNetworksAutoDetected);
      setIpNetworksString(ipNetworksToString(ipNetworksAutoDetected));
    }
  }, [autoDetectNetworks, onIpNetworksChange, ipNetworksAutoDetected]);

  function setIpNetworkAutoDetection(value: boolean) {
    if (value) {
      props.onIpNetworksChange(ipNetworksAutoDetected);
      setIpNetworksString(ipNetworksToString(ipNetworksAutoDetected));
      props.onAutoDetectNetworksChange(true);
    } else {
      props.onAutoDetectNetworksChange(false);
    }
  }

  function onCheckboxAutoDetectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIpNetworkAutoDetection(e.target.checked);
  }

  const updateIpNetworks = useCallback((value: string): boolean => {
    let ipNetworksNew: IPNetwork[] = [];
    try {
      ipNetworksNew = stringToIpNetworks(value);
    } catch (err) {
      console.log('check', value, ':', false); // TODO: Remove
      return false;
    }
    onIpNetworksChange(ipNetworksNew);
    console.log('check', value, ':', true); // TODO: Remove
    return true;
  }, [onIpNetworksChange]);

  const { wasValidated } = props;
  const updateInputNetwork = useCallback((value: string) => {
    setIpNetworksString(value);
    if (wasValidated) {
      const valid = updateIpNetworks(value);
      console.log('valid', valid); // TODO: Remove
      setIpNetworksShowInvalid(!valid);
    } else {
      console.log('valid', false); // TODO: Remove
      setIpNetworksShowInvalid(false);
    }
  }, [wasValidated, updateIpNetworks]);

  function onInputNetworkChange (e: React.ChangeEvent<HTMLInputElement>) {
    updateInputNetwork(e.target.value);
  }

  useEffect(() => {
    updateInputNetwork(ipNetworksString);
  }, [updateInputNetwork, ipNetworksString]);

  const inputNetworkClassName = ipNetworksShowInvalid ? 'form-control is-invalid' : 'form-control';

  return (
    <>
      <div className="mb-3">
        <label htmlFor="inputNetwork" className="form-label">IP network</label>
        <input
          type="text"
          className={inputNetworkClassName}
          id="inputNetwork"
          value={ipNetworksString}
          placeholder="Enter network, e.g. 192.168.178.0/24"
          onChange={onInputNetworkChange}
          disabled={props.autoDetectNetworks}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="checkboxAutoDetect"
          checked={props.autoDetectNetworks}
          onChange={onCheckboxAutoDetectChange}
        />
        &nbsp;
        <label className="form-check-label checkbox-fix" htmlFor="checkboxAutoDetect">Automatically detect network</label>
      </div>
    </>
  );
}

export default IPNetworkPanel;

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

  autoDetect: boolean;
  onAutoDetectChange: React.Dispatch<React.SetStateAction<boolean>>;

  wasValidated: boolean;
}

function IPNetworkPanel(props: IPNetworkPanelProps) {
  const [autoDetectedNetworks, setAutoDetectedNetworks] = useState<IPNetwork[]>([]);
  const [inputNetwork, setInputNetwork] = useState<string>('');
  const [inputNetworkInvalid, setInputNetworkInvalid] = useState<boolean>(false);

  // Execute once on page load
  useEffect(() => {
    // TODO: Fetch IP networks from server
    const ipNetworksAutoDetectedMock: IPNetwork[] = [
      { ip: "192.168.178.0", prefix: 24 },
      { ip: "192.168.188.0", prefix: 24 }
    ];
    window.setTimeout(() => {
      setAutoDetectedNetworks(ipNetworksAutoDetectedMock);
    }, 5000);
  }, []);

  // Execute whenever autoDetect, autoDetectedNetworks (or onIpNetworksChange) changes.
  const { autoDetect, onIpNetworksChange } = props;
  useEffect(() => {
    if (autoDetect) {
      onIpNetworksChange(autoDetectedNetworks);
      setInputNetwork(ipNetworksToString(autoDetectedNetworks));
      setInputNetworkInvalid(false);
    }
  }, [autoDetect, onIpNetworksChange, autoDetectedNetworks]);

  function setIpNetworkAutoDetection(value: boolean) {
    if (value) {
      props.onIpNetworksChange(autoDetectedNetworks);
      setInputNetwork(ipNetworksToString(autoDetectedNetworks));
      props.onAutoDetectChange(true);
    } else {
      props.onAutoDetectChange(false);
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
    setInputNetwork(value);
    if (wasValidated) {
      const valid = updateIpNetworks(value);
      console.log('valid', valid); // TODO: Remove
      setInputNetworkInvalid(!valid);
    } else {
      console.log('valid', false); // TODO: Remove
      setInputNetworkInvalid(false);
    }
  }, [wasValidated, updateIpNetworks]);

  function onInputNetworkChange (e: React.ChangeEvent<HTMLInputElement>) {
    updateInputNetwork(e.target.value);
  }

  useEffect(() => {
    updateInputNetwork(inputNetwork);
  }, [updateInputNetwork, inputNetwork]);

  const inputNetworkClassName = inputNetworkInvalid ? 'form-control is-invalid' : 'form-control';

  return (
    <>
      <div className="mb-3">
        <label htmlFor="inputNetwork" className="form-label">IP network</label>
        <input
          type="text"
          className={inputNetworkClassName}
          id="inputNetwork"
          value={inputNetwork}
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

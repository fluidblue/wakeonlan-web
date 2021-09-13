import React, { useEffect, useState } from 'react';

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
}

function IPNetworkPanel(props: IPNetworkPanelProps) {
  const [ipNetworksAutoDetected, setIpNetworksAutoDetected] = useState<IPNetwork[]>([]);
  const [ipNetworksString, setIpNetworksString] = useState<string>('');

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

  function updateIpNetworks() {
    let valid: boolean = true;
    let ipNetworksNew: IPNetwork[] = [];
    try {
      ipNetworksNew = stringToIpNetworks(ipNetworksString);
    } catch (err) {
      valid = false;
    }

    if (valid) {
      console.log('valid', ipNetworksNew); // TODO: Remove
    } else {
      console.log('invalid', ipNetworksString); // TODO: Remove
    }
  }

  function onInputNetworkChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIpNetworksString(e.target.value);
  }

  return (
    <>
      <div className="mb-3">
        <label htmlFor="inputNetwork" className="form-label">IP network</label>
        <input
          type="text"
          className="form-control"
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

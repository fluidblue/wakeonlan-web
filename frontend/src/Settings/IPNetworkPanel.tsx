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

/**
 * Regular expression for multiple CIDR IP networks.
 * Must be in string format for usage with HTML element attribute 'pattern'.
 * 
 * Pattern                              Match
 * 1.2.3.4/24                           Yes
 * 1.2.3.4/                             No
 * 1.2.3                                No
 * 1.2.3.4/24,1.2.3.4/32                Yes
 * 1.2.3.4/24, 1.2.3.4/32               Yes
 * 1.2.3.4/24,  1.2.3.4/32              Yes
 * 1.2.3.4/24, 1.2.3.4/32, 1.2.3.4/24   Yes
 */
const RE_CIDR_IP_NETWORKS: string = '^(?:[0-9]{1,3}(?:\\.[0-9]{1,3}){3}\\/[0-9]{1,2})(?:,\\s*[0-9]{1,3}(?:\\.[0-9]{1,3}){3}\\/[0-9]{1,2})*$';

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
          pattern={RE_CIDR_IP_NETWORKS}
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

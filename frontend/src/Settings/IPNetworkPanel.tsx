import React, { useCallback, useContext, useEffect, useState } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';
import { API } from '../API';
import { ipNetworksToString, stringToIpNetworks } from './IPUtilities'

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

  const api = useContext(API);

  // Execute once on page load.
  // Fetch data for autoDetectedNetworks.
  useEffect(() => {
    const fetchData = async () => {
      const uri = api + '/ip-networks';
      const response = await fetch(uri, {
        method: 'GET',
        keepalive: true
      });
      if (!response.ok || !response.body) {
        console.error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
        return;
      }
      const rawData: string[] = await response.json();
      let data: IPNetwork[] = [];
      try {
        data = rawData.map((network) => {
          return IPFunctions.getIPNetworkFromString(network);
        });
      } catch (err) {
        console.error('Could not parse data of ' + uri + ' (' + err + ')');
        return;
      }
      setAutoDetectedNetworks(data);
    };
    fetchData();
  }, [api]);

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
      onIpNetworksChange(autoDetectedNetworks);
      setInputNetwork(ipNetworksToString(autoDetectedNetworks));
      setInputNetworkInvalid(false);
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
      return false;
    }
    onIpNetworksChange(ipNetworksNew);
    return true;
  }, [onIpNetworksChange]);

  const { wasValidated } = props;
  const updateInputNetwork = useCallback((value: string) => {
    setInputNetwork(value);
    if (wasValidated) {
      const valid = updateIpNetworks(value);
      setInputNetworkInvalid(!valid);
    } else {
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

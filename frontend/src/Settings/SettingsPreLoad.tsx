import React, { useEffect } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';
import { apiUri } from '../API';
import { SettingsData } from './Settings';

async function fetchIpNetworks() {
  const uri = apiUri + '/ip-networks';
  const response = await fetch(uri, {
    method: 'GET'
  });
  if (!response.ok || !response.body) {
    throw new Error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
  }
  const rawData: string[] = await response.json();
  let data: IPNetwork[] = [];
  try {
    data = rawData.map((network) => {
      return IPFunctions.getIPNetworkFromString(network);
    });
  } catch (err) {
    throw new Error('Could not parse data of ' + uri + ' (' + err + ')');
  }
  return data;
};

async function fetchSettings() {
  const uri = apiUri + '/settings';
  const response = await fetch(uri, {
    method: 'GET'
  });
  if (!response.ok || !response.body) {
    throw new Error('Could not fetch ' + uri + ' (HTTP ' + response.status + ')');
  }
  return await response.json();
}

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
  onSettingsChange: React.Dispatch<React.SetStateAction<SettingsData>>;
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  // Execute once on component load
  const {
    onAutoDetectedNetworksChange,
    onSettingsChange
  } = props;
  useEffect(() => {
    async function fetchData() {
      const ipNetworks: IPNetwork[] = await fetchIpNetworks();
      onAutoDetectedNetworksChange(ipNetworks);

      const settings = await fetchSettings();
      onSettingsChange(settings);
    };
    fetchData();
  }, [
    onAutoDetectedNetworksChange,
    onSettingsChange
  ]);

  return <></>;
}

export default SettingsPreLoad;

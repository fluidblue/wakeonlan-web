import React, { useEffect } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';
import { apiUri } from '../API';

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

  onAutoDetectNetworksChange: React.Dispatch<React.SetStateAction<boolean>>
  onIpNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
  onWolPortChange: React.Dispatch<React.SetStateAction<number>>
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  // Execute once on component load
  const {
    onAutoDetectedNetworksChange,
    onAutoDetectNetworksChange,
    onIpNetworksChange,
    onWolPortChange
  } = props;
  useEffect(() => {
    async function fetchData() {
      const ipNetworks: IPNetwork[] = await fetchIpNetworks();
      onAutoDetectedNetworksChange(ipNetworks);

      const settings = await fetchSettings();
      onAutoDetectNetworksChange(settings.autoDetectNetworks);
      onIpNetworksChange(settings.ipNetworks);
      onWolPortChange(settings.wolPort);
    };
    fetchData();
  }, [
    onAutoDetectedNetworksChange,
    onAutoDetectNetworksChange,
    onIpNetworksChange,
    onWolPortChange
  ]);

  return <></>;
}

export default SettingsPreLoad;

import React, { useEffect } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';
import { apiUri } from '../API';

const fetchIpNetworks = async () => {
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

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  // Execute once on component load.
  // Fetch data for autoDetectedNetworks.
  const { onAutoDetectedNetworksChange } = props;
  useEffect(() => {
    async function fetchData() {
      const ipNetworks: IPNetwork[] = await fetchIpNetworks();
      onAutoDetectedNetworksChange(ipNetworks);
    };
    fetchData();
  }, [onAutoDetectedNetworksChange]);

  return <></>;
}

export default SettingsPreLoad;

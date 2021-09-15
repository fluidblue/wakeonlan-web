import React, { useContext, useEffect } from 'react';

import { IPFunctions, IPNetwork } from 'wakeonlan-utilities';
import { API } from '../API';

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  const api = useContext(API);

  // Execute once on component load.
  // Fetch data for autoDetectedNetworks.
  const { onAutoDetectedNetworksChange } = props;
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
      onAutoDetectedNetworksChange(data);
    };
    fetchData();
  }, [api, onAutoDetectedNetworksChange]);

  return <></>;
}

export default SettingsPreLoad;

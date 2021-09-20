import React, { useEffect } from 'react';

import { IPNetwork, SettingsData } from 'wakeonlan-utilities';
import API from '../API';

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
      const ipNetworks: IPNetwork[] = await API.ipNetworksLoad();
      onAutoDetectedNetworksChange(ipNetworks);

      const settings = await API.settingsLoad();
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

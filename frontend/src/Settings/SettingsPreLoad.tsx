import React, { useEffect, useState } from 'react';

import { IPNetwork, SettingsData } from 'wakeonlan-utilities';
import API from '../API';

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
  onSettingsChange: React.Dispatch<React.SetStateAction<SettingsData>>;

  onNewToastMessage: (message: React.ReactNode) => void;
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  const [firstTry, setFirstTry] = useState<boolean>(true);

  // Execute once on component load
  const {
    onAutoDetectedNetworksChange,
    onSettingsChange,
    onNewToastMessage
  } = props;
  useEffect(() => {
    async function fetchData() {
      if (!firstTry) {
        return;
      }
      setFirstTry(false);

      try {
        const settings = await API.settingsLoad();
        const ipNetworks: IPNetwork[] = await API.ipNetworksLoad();

        onSettingsChange(settings);
        onAutoDetectedNetworksChange(ipNetworks);
      } catch (err) {
        onNewToastMessage('Failed to load settings.');
        console.error(err);
      }
    };
    fetchData();
  }, [
    onAutoDetectedNetworksChange,
    onSettingsChange,
    onNewToastMessage,
    firstTry
  ]);

  return <></>;
}

export default SettingsPreLoad;

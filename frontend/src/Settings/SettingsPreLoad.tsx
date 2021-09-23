import React, { useEffect, useState } from 'react';

import { IPNetwork, SettingsData } from 'wakeonlan-utilities';
import API from '../API';

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
  onSettingsChange: React.Dispatch<React.SetStateAction<SettingsData>>;

  onNewToastMessage: (message: React.ReactNode) => void;
}

function SettingsPreLoad(props: SettingsPreLoadProps) {
  const [settingsLoadExecuted, setSettingsLoadExecuted] = useState<boolean>(false);

  // Execute once on component load
  const {
    onAutoDetectedNetworksChange,
    onSettingsChange,
    onNewToastMessage
  } = props;
  useEffect(() => {
    async function fetchData() {
      if (settingsLoadExecuted) {
        return;
      }
      setSettingsLoadExecuted(true);

      try {
        const ipNetworks: IPNetwork[] = await API.ipNetworksLoad();
        const settings = await API.settingsLoad();

        onAutoDetectedNetworksChange(ipNetworks);
        onSettingsChange(settings);
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
    settingsLoadExecuted
  ]);

  return <></>;
}

export default SettingsPreLoad;

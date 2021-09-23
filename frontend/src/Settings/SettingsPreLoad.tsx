import React from 'react';

import { IPNetwork, SettingsData } from 'wakeonlan-utilities';
import API from '../API';

interface SettingsPreLoadProps {
  onAutoDetectedNetworksChange: React.Dispatch<React.SetStateAction<IPNetwork[]>>
  onSettingsChange: React.Dispatch<React.SetStateAction<SettingsData>>;

  onNewToastMessage: (message: React.ReactNode) => void;
}

class SettingsPreLoad extends React.Component<SettingsPreLoadProps> {
  async componentDidMount() {
    try {
      const ipNetworks: IPNetwork[] = await API.ipNetworksLoad();
      const settings = await API.settingsLoad();

      this.props.onAutoDetectedNetworksChange(ipNetworks);
      this.props.onSettingsChange(settings);
    } catch (err) {
      this.props.onNewToastMessage('Failed to load settings.');
      console.error(err);
    }
  }

  render() {
    return <></>;
  }
}

export default SettingsPreLoad;

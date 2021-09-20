import React, { useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import SavedHosts from './SavedHosts/SavedHosts';
import Discover from './Discover/Discover';
import Settings from './Settings/Settings';
import SettingsPreLoad from './Settings/SettingsPreLoad';
import EditHost from './EditHost/EditHost';
import NotFound from './NotFound';

import ToastContainer from './Toasts/ToastContainer';
import ToastItem from './Toasts/ToastItem';

import { Host, IPNetwork, SettingsData, settingsDataDefault } from 'wakeonlan-utilities';

function App() {
  const [savedHosts, setSavedHosts] = useState<Host[]>([
    { name: 'Hostname 1', mac: '00:11:22:33:44:55' },
    { name: 'Hostname 2', mac: '00:11:22:33:44:66' },
    { name: 'Hostname 3', mac: '00:11:22:33:44:77' }
  ]);

  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  const [scanned, setScanned] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<Host[]>([]);

  const [autoDetectedNetworks, setAutoDetectedNetworks] = useState<IPNetwork[]>([]);
  const [settings, setSettings] = useState<SettingsData>(settingsDataDefault);

  const [toastItems, setToastItems] = useState<React.ReactNode[]>([]);

  function onNewToastMessage(message: React.ReactNode) {
    setToastItems(toastItems.concat(
      <ToastItem key={Date.now()}>
        {message}
      </ToastItem>
    ));
  }

  function onSettingsSaved(result: boolean) {
    const text = result ? 'The settings have been saved.' : 'Failed to save settings.';
    onNewToastMessage(text);
  }

  function onHostSaved(result: boolean) {
    const text = result ? 'The host has been saved.' : 'The host could not be saved.';
    onNewToastMessage(text);
  }

  function getIpNetworks(): IPNetwork[] {
    if (settings.autoDetectNetworks) {
      return autoDetectedNetworks;
    } else {
      return settings.ipNetworks;
    }
  }

  return (
    <Router>
      <SettingsPreLoad
        onAutoDetectedNetworksChange={setAutoDetectedNetworks}
        onSettingsChange={setSettings}
      />
      <Navbar />
      <hr className="header-separator" />
      <main>
        <Switch>
          <Route exact path={["/hosts", "/"]}>
            <SavedHosts
              onHostToBeAddedChange={setHostToBeAdded}
              onNewToastMessage={onNewToastMessage}
              savedHosts={savedHosts}
              settings={settings}
            />
          </Route>
          <Route path="/discover">
            <Discover
              onHostToBeAddedChange={setHostToBeAdded}
              onDiscoveredHostsChange={setDiscoveredHosts}
              discoveredHosts={discoveredHosts}
              onScannedChange={setScanned}
              scanned={scanned}
              ipNetworks={getIpNetworks()}
            />
          </Route>
          <Route path="/settings">
            <Settings
              autoDetectedNetworks={autoDetectedNetworks}
              settings={settings}
              onSettingsChange={setSettings}
              onSettingsSaved={onSettingsSaved}
            />
          </Route>
          <Route path="/add">
            <EditHost
              host={hostToBeAdded}
              add={true}
              savedHosts={savedHosts}
              onSavedHostsChange={setSavedHosts}
              onHostSaved={onHostSaved}
            />
          </Route>
          <Route path="/edit/:id">
            <EditHost
              host={hostToBeAdded}
              savedHosts={savedHosts}
              onSavedHostsChange={setSavedHosts}
              onHostSaved={onHostSaved}
            />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </main>
      <ToastContainer>
        {toastItems}
      </ToastContainer>
    </Router>
  );
}

export default App;

import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
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
import API from './API';

function App() {
  const [savedHosts, setSavedHosts] = useState<Host[]>([]);
  const [savedHostsLoadExecuted, setSavedHostsLoaded] = useState<boolean>(false);

  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  const [scanned, setScanned] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<Host[]>([]);

  const [autoDetectedNetworks, setAutoDetectedNetworks] = useState<IPNetwork[]>([]);
  const [settings, setSettings] = useState<SettingsData>(settingsDataDefault);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  const [toastItems, setToastItems] = useState<React.ReactNode[]>([]);

  const onNewToastMessage = useCallback((message: React.ReactNode) => {
    setToastItems(toastItems.concat(
      <ToastItem key={Date.now()}>
        {message}
      </ToastItem>
    ));
  }, [toastItems]);

  function getIpNetworks(): IPNetwork[] {
    if (settings.autoDetectNetworks) {
      return autoDetectedNetworks;
    } else {
      return settings.ipNetworks;
    }
  }
  const ipNetworks = getIpNetworks();

  function getOrderedHosts(hosts: Host[]) {
    return hosts.sort((a: Host, b: Host) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      // Names must be equal
      return 0;
    });
  }
  const orderedSavedHosts = getOrderedHosts(savedHosts);

  useEffect(() => {
    let subscribed = true;

    async function loadHosts() {
      if (savedHostsLoadExecuted) {
        return;
      }

      let hosts: Host[] = [];
      let error: Error | null = null;
      try {
        hosts = await API.savedHostsLoad();
      } catch (err) {
        error = err as Error;
      }
      if (!subscribed) {
        return;
      }

      setSavedHosts(hosts);
      setSavedHostsLoaded(true);

      if (error) {
        onNewToastMessage('Failed to load saved hosts.');
        console.error(error);
      }
    }
    loadHosts();

    return () => {
      subscribed = false;
    };
  }, [savedHostsLoadExecuted, onNewToastMessage]);

  function onSettingsChange(settings: SetStateAction<SettingsData>) {
    setSettings(settings);
    setSettingsLoaded(true);
  }

  return (
    <Router>
      <SettingsPreLoad
        onAutoDetectedNetworksChange={setAutoDetectedNetworks}
        onSettingsChange={onSettingsChange}
        onNewToastMessage={onNewToastMessage}
      />
      <Navbar />
      <hr className="header-separator" />
      <main>
        <Switch>
          <Route exact path={["/hosts", "/"]}>
            <SavedHosts
              onHostToBeAddedChange={setHostToBeAdded}
              onNewToastMessage={onNewToastMessage}
              savedHosts={orderedSavedHosts}
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
              ipNetworks={ipNetworks}
              onNewToastMessage={onNewToastMessage}
              settingsLoaded={settingsLoaded}
            />
          </Route>
          <Route path="/settings">
            <Settings
              autoDetectedNetworks={autoDetectedNetworks}
              settings={settings}
              onSettingsChange={onSettingsChange}
              onNewToastMessage={onNewToastMessage}
            />
          </Route>
          <Route path="/add">
            <EditHost
              host={hostToBeAdded}
              add={true}
              savedHosts={orderedSavedHosts}
              onSavedHostsChange={setSavedHosts}
              onNewToastMessage={onNewToastMessage}
            />
          </Route>
          <Route path="/edit/:id">
            <EditHost
              host={hostToBeAdded}
              savedHosts={orderedSavedHosts}
              onSavedHostsChange={setSavedHosts}
              onNewToastMessage={onNewToastMessage}
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

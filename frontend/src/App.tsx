import React, { useCallback, useEffect, useState } from 'react';
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
  const [savedHostsLoaded, setSavedHostsLoaded] = useState<boolean>(false);

  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  const [scanned, setScanned] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<Host[]>([]);

  const [autoDetectedNetworks, setAutoDetectedNetworks] = useState<IPNetwork[]>([]);
  const [settings, setSettings] = useState<SettingsData>(settingsDataDefault);

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

  useEffect(() => {
    async function loadHosts() {
      if (savedHostsLoaded) {
        return;
      }

      let hosts;
      try {
        hosts = await API.savedHostsLoad();
      } catch (err) {
        onNewToastMessage('Failed to load saved hosts.');
        return;
      }
      setSavedHosts(hosts);
      setSavedHostsLoaded(true);
    }
    loadHosts();
  }, [onNewToastMessage]);

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
              onNewToastMessage={onNewToastMessage}
            />
          </Route>
          <Route path="/add">
            <EditHost
              host={hostToBeAdded}
              add={true}
              savedHosts={savedHosts}
              onSavedHostsChange={setSavedHosts}
              onNewToastMessage={onNewToastMessage}
            />
          </Route>
          <Route path="/edit/:id">
            <EditHost
              host={hostToBeAdded}
              savedHosts={savedHosts}
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

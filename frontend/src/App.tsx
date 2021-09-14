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
import EditHost from './EditHost/EditHost';
import NotFound from './NotFound';

import ToastContainer from './Toasts/ToastContainer';
import ToastItem from './Toasts/ToastItem';

import Host from './Host';

function App() {
  const [savedHosts, setSavedHosts] = useState<Host[]>([
    { name: 'Hostname 1', mac: '00:11:22:33:44:55' },
    { name: 'Hostname 2', mac: '00:11:22:33:44:66' },
    { name: 'Hostname 3', mac: '00:11:22:33:44:77' }
  ]);

  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  const [scanned, setScanned] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<Host[]>([]);

  const [toastItems, setToastItems] = useState<React.ReactNode[]>([]);

  function onHostWoken(hostname: string, mac: string) {
    setToastItems(toastItems.concat(
      <ToastItem key={Date.now()}>
        Wake-on-LAN packet sent to:<br />
        {hostname}
      </ToastItem>
    ));
  }

  return (
    <Router>
      <Navbar />
      <hr className="header-separator" />
      <main>
        <Switch>
          <Route exact path={["/hosts", "/"]}>
            <SavedHosts
              onHostToBeAddedChange={setHostToBeAdded}
              onHostWoken={onHostWoken}
              savedHosts={savedHosts}
            />
          </Route>
          <Route path="/discover">
            <Discover
              onHostToBeAddedChange={setHostToBeAdded}
              onDiscoveredHostsChange={setDiscoveredHosts}
              discoveredHosts={discoveredHosts}
              onScannedChange={setScanned}
              scanned={scanned}
            />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/add">
            <EditHost host={hostToBeAdded} add={true} />
          </Route>
          <Route path="/edit/:id">
            <EditHost host={hostToBeAdded} />
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

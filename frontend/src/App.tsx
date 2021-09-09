import React, { useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Navbar from './Navbar';
import SavedHosts from './SavedHosts';
import Discover from './Discover';
import Settings from './Settings';
import EditHost from './EditHost';
import NotFound from './NotFound';

import ToastContainer from './ToastContainer';
import ToastItem from './ToastItem';

import Host from './Host';

function App() {
  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  const [scanned, setScanned] = useState(false);
  const [discoveredHosts, setDiscoveredHosts] = useState<Host[]>([]);

  const [toastItems, setToastItems] = useState<React.ReactNode[]>([]);

  let api = '/api';
  if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:8000' + api;
  }

  function onHostWoken(hostname: string, mac: string) {
    setToastItems(toastItems.concat(
      <ToastItem>
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
            <SavedHosts onHostToBeAddedChange={setHostToBeAdded} onHostWoken={onHostWoken} />
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

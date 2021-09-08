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

import Host from './Host';

function App() {
  const [hostToBeAdded, setHostToBeAdded] = useState<Host | null>(null);

  let api = '/api';
  if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:8000' + api;
  }

  return (
    <Router>
      <Navbar />
      <hr className="header-separator" />
      <main>
        <Switch>
          <Route exact path={["/hosts", "/"]}>
            <SavedHosts onHostToBeAddedChange={setHostToBeAdded} />
          </Route>
          <Route path="/discover">
            <Discover onHostToBeAddedChange={setHostToBeAdded} />
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
      <ToastContainer />
    </Router>
  );
}

export default App;

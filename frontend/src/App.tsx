import React from 'react';
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
import ToastContainer from './ToastContainer';

function App() {
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
          <Route path="/discover">
            <Discover />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/add">
            <EditHost add={true} />
          </Route>
          <Route path="/edit/:id">
            <EditHost />
          </Route>
          <Route path={["/hosts", "/"]}>
            <SavedHosts />
          </Route>
        </Switch>
      </main>
      <ToastContainer />
    </Router>
  );
}

export default App;

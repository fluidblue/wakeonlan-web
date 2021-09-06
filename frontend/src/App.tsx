import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Navbar from './Navbar';
import SavedHosts from './SavedHosts';
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
            Discover
          </Route>
          <Route path="/settings">
            Settings
          </Route>
          <Route path="/add">
            Add host
          </Route>
          <Route path="/edit/:id">
            Edit host
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

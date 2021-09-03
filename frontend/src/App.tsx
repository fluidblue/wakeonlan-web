import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  let api = '/api';
  if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:8000';
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a href={api + "/host-discovery/arp-scan"}>API test</a>
      </header>
    </div>
  );
}

export default App;

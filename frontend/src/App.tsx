import React from 'react';
import './App.css';

import Navbar from './Navbar';
import SavedHosts from './SavedHosts';
import ToastContainer from './ToastContainer';

function App() {
  let api = '/api';
  if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:8000' + api;
  }

  return (
    <>
      <Navbar />
      <hr className="header-separator" />
      <main>
        <SavedHosts />
      </main>
      <ToastContainer />
    </>
  );
}

export default App;

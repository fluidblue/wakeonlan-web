import React from 'react';

function getAPIUri() {
  let uri = '/api';
  if (process.env.NODE_ENV === 'development') {
    uri = 'http://localhost:8000' + uri;
  }
  return uri;
}

export const API = React.createContext(getAPIUri());

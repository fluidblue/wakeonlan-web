function getAPIUri() {
  let uri = '/api';
  if (process.env.NODE_ENV === 'development') {
    uri = window.location.protocol + '//' + window.location.hostname + ':8000' + uri;
  }
  return uri;
}

export const apiUri = getAPIUri();

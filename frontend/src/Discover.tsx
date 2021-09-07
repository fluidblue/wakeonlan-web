import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './Discover.css';

import HostItem from './HostItem';

function Discover() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const history = useHistory();

  function handleItemClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    history.push('/add');
  }

  function handleRescanClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setScanned(false);
    startScan();
  }

  function handleAddManuallyClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    history.push('/add');
  }

  const startScan = useCallback(() => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 3000);
  }, []);

  // Start scanning when the activity is entered.
  useEffect(() => {
    if (!scanned) {
      startScan();
    }
  }, [scanned, startScan]);

  let spinner = null;
  if (scanning) {
    spinner = (
      <div className="d-flex align-items-center mt-3 mx-2 spinner">
        <span className="fw-bold">Scanning 192.168.188.0/24</span>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  let scanFinishedNotice = null;
  if (!scanning) {
    scanFinishedNotice = (
      <div className="d-flex flex-column align-items-center mx-2 mt-4 scan-finished-notice">
        <div>
          <div className="fw-bold text-center">Scan finished.</div>
        </div>
        <div className="mt-3">
          <div className="text-center mb-2">Host not found?</div>
          <div className="d-flex">
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleRescanClick}>Rescan</button>
            <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={handleAddManuallyClick}>Add manually</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="host-discovery-notice text-muted">
        Note: For host discovery, hosts must be powered on.
      </div>

      <ul className="list-group">
        <HostItem hostname="Hostname 1" mac="00:11:22:33:44:55" handleItemClick={handleItemClick} />
        <HostItem hostname="Hostname 2" mac="00:11:22:33:44:55" handleItemClick={handleItemClick} />
        <HostItem hostname="Hostname 3" mac="00:11:22:33:44:55" handleItemClick={handleItemClick} />
      </ul>

      {spinner}

      {scanFinishedNotice}
    </>
  );
}

export default Discover;

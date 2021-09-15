import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './Discover.css';

import HostItem from './HostItem';
import Host from '../Host';
import { API } from '../API';

interface HostMacIP {
  ip: string;
  mac: string;
}

interface DiscoverProps {
  onHostToBeAddedChange: React.Dispatch<React.SetStateAction<Host | null>>;

  onDiscoveredHostsChange: React.Dispatch<React.SetStateAction<Host[]>>;
  discoveredHosts: Host[];

  onScannedChange: React.Dispatch<React.SetStateAction<boolean>>;
  scanned: boolean;
}

function Discover(props: DiscoverProps) {
  const [scanning, setScanning] = useState(false);
  const history = useHistory();
  const api = useContext(API);

  function handleItemClick(host: Host) {
    props.onHostToBeAddedChange(host);
    history.push('/add');
  }

  function handleAddManuallyClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.onHostToBeAddedChange(null);
    history.push('/add');
  }

  function handleRescanClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.onScannedChange(false);
  }

  const fetchHostname = useCallback(async (ip: string) => {
    const response = await fetch(api + '/device-name/host-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ip: ip
      })
    });
    if (response.ok) {
      return response.text();
    } else {
      return ip;
    }
  }, [api]);
  

  // Destructure props for useEffect
  const { scanned, onDiscoveredHostsChange, onScannedChange } = props;

  // Start scanning when the activity is entered.
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (scanned) {
        return;
      }
      onDiscoveredHostsChange([]);
      setScanning(true);

      const response = await fetch(api + '/host-discovery/arp-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'ip-network': '192.168.188.0/24' // TODO: Specify nets configured in settings
        })
      });
      const rawData = await response.text();
      let data: Host[] = [];
      for (let line of rawData.split('\n')) {
        line = line.trim();
        if (line.length === 0) {
          continue;
        }
        const resultObject = JSON.parse(line);
        if (!resultObject.result) {
          data = [];
          break;
        }
        const hostMacIp: HostMacIP = resultObject;

        const host: Host = {
          name: await fetchHostname(hostMacIp.ip),
          mac: hostMacIp.mac
        };
        data.push(host);
      }

      if (ignore) {
        return;
      }
      setScanning(false);
      onScannedChange(true);
      onDiscoveredHostsChange(data);
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [scanned, api, onDiscoveredHostsChange, onScannedChange, fetchHostname]);

  let spinner = null;
  if (scanning) {
    spinner = (
      <div className="d-flex align-items-center mx-2 spinner">
        <span className="fw-bold">Scanning 192.168.188.0/24</span>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div>
    );
  }

  let scanFinishedNotice = null;
  if (props.scanned) {
    scanFinishedNotice = (
      <div className="d-flex flex-column align-items-center mx-2 scan-finished-notice">
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

  const hostItems = props.discoveredHosts.map((host) => {
    return <HostItem host={host} onClick={handleItemClick} key={host.name + host.mac} />;
  });
  let hostItemsParent = null;
  if (hostItems && hostItems.length > 0) {
    hostItemsParent = (
      <ul className="list-group mb-4">
        {hostItems}
      </ul>
    );
  }

  return (
    <>
      <div className="host-discovery-notice text-muted">
        Note: For host discovery, hosts must be powered on.
      </div>
      {hostItemsParent}
      {spinner}
      {scanFinishedNotice}
    </>
  );
}

export default Discover;

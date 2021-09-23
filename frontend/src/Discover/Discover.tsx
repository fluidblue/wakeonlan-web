import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './Discover.css';

import HostItem from './HostItem';
import API from '../API';
import { Host, IPNetwork } from 'wakeonlan-utilities';
import { ipNetworksToString } from '../IPUtilities';

interface DiscoverProps {
  onHostToBeAddedChange: React.Dispatch<React.SetStateAction<Host | null>>;
  onNewToastMessage: (message: React.ReactNode) => void;

  onDiscoveredHostsChange: React.Dispatch<React.SetStateAction<Host[]>>;
  discoveredHosts: Host[];

  onScannedChange: React.Dispatch<React.SetStateAction<boolean>>;
  scanned: boolean;

  ipNetworks: IPNetwork[];
  settingsLoaded: boolean;
}

function Discover(props: DiscoverProps) {
  const [scanning, setScanning] = useState(false);
  const history = useHistory();

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

  async function hostDiscovery(ipNetworks: IPNetwork[]): Promise<Host[]> {
    console.log("Scan will start.", ipNetworks); // TODO: Remove
    let hosts: Host[] = [];

    const hostDiscoveryPromises: Promise<Host[]>[] = [];
    for (const ipNetwork of ipNetworks) {
      const hostDiscoveryPromise = API.hostDiscovery(ipNetwork);
      hostDiscoveryPromises.push(hostDiscoveryPromise);
    }
    const hostDiscoveryResults: Host[][] = await Promise.all(hostDiscoveryPromises);
    hosts = hostDiscoveryResults.reduce((previousValue, currentValue) => {
      return previousValue.concat(currentValue);
    }, []);

    // Filter out duplicates
    hosts = hosts.filter((host, index) => {
      return index === hosts.findIndex((item) => {
        return item.name === host.name && item.mac === host.mac;
      });
    });

    return hosts;
  }

  // Destructure props for useEffect
  const { scanned, settingsLoaded, ipNetworks, onDiscoveredHostsChange, onScannedChange, onNewToastMessage } = props;

  // Start scanning when the activity is entered.
  useEffect(() => {
    let subscribed = true;

    console.log("effect:", {
      scanned: scanned,
      settingsLoaded: settingsLoaded,
      ipNetworks: ipNetworks
    });

    async function fetchData() {
      if (scanned || !settingsLoaded) {
        return;
      }
      onDiscoveredHostsChange([]);
      setScanning(true);

      let hosts: Host[] = [];
      let error: Error | null = null;
      try {
        hosts = await hostDiscovery(ipNetworks);
      } catch (err) {
        error = err as Error;
      }

      if (!subscribed) {
        return;
      }

      setScanning(false);
      onScannedChange(true);
      onDiscoveredHostsChange(hosts);

      if (error) {
        onNewToastMessage('Host discovery failed. See console for details.');
        console.error('Error during host discovery:', error);
      }
    }
    fetchData();

    return () => {
      subscribed = false;
    };
  }, [scanned, settingsLoaded, ipNetworks, onDiscoveredHostsChange, onScannedChange, onNewToastMessage]);

  let spinner = null;
  if (scanning) {
    const ipNetworksString = ipNetworksToString(ipNetworks);
    spinner = (
      <div className="d-flex align-items-center mx-2 spinner">
        <span className="fw-bold">Scanning {ipNetworksString}</span>
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

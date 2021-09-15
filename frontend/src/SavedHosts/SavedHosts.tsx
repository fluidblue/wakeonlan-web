import React from 'react';
import './SavedHosts.css';

import { Link, useHistory } from 'react-router-dom';

import Host from '../Host';
import SavedHost from './SavedHost';

interface SavedHostsProps {
  onHostToBeAddedChange: React.Dispatch<React.SetStateAction<Host | null>>;
  onHostWoken: (hostname: string, mac: string, result: boolean) => void;
  savedHosts: Host[];
}

function SavedHosts(props: SavedHostsProps) {
  const history = useHistory();

  const manualAddClickHref = '/add';
  function handleManualAddClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    props.onHostToBeAddedChange(null);
    history.push(manualAddClickHref);
  }

  const savedHosts = props.savedHosts.map((savedHost) => {
    return (
      <SavedHost
        hostname={savedHost.name}
        mac={savedHost.mac}
        onWoken={props.onHostWoken}
        key={savedHost.mac}
      />
    );
  });

  return (
    <>
      <ul className="list-group">
        {savedHosts}
      </ul>

      <div className="add-button-container">
        <div className="btn-group dropup">
          <button type="button" className="btn btn-primary rounded-circle dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,5" aria-expanded="false" title="Add">
            <i className="bi bi-plus-lg"></i>
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href={manualAddClickHref} onClick={handleManualAddClick}>Manual</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/discover">Automatic</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SavedHosts;

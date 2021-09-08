import React from 'react';
import './SavedHosts.css';

import { Link, useHistory } from 'react-router-dom';

import Host from './Host';
import SavedHost from './SavedHost';

interface SavedHostsProps {
  onHostToBeAddedChange: React.Dispatch<React.SetStateAction<Host | null>>;
}

function SavedHosts(props: SavedHostsProps) {
  const history = useHistory();

  const manualAddClickHref = '/add';
  function handleManualAddClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    props.onHostToBeAddedChange(null);
    history.push(manualAddClickHref);
  }

  return (
    <>
      <ul className="list-group">
        <SavedHost hostname="Hostname 1" mac="00:11:22:33:44:55" />
        <SavedHost hostname="Hostname 2" mac="00:11:22:33:44:66" />
        <SavedHost hostname="Hostname 3" mac="00:11:22:33:44:77" />
      </ul>

      <div className="btn-group dropup add">
        <button type="button" className="btn btn-primary rounded-circle dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,5" aria-expanded="false">
          <i className="bi bi-plus-lg"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href={manualAddClickHref} onClick={handleManualAddClick}>Manual</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/discover">Automatic</Link></li>
        </ul>
      </div>
    </>
  );
}

export default SavedHosts;

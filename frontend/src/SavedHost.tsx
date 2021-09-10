import React from 'react';
import './SavedHost.css';

import { useHistory } from 'react-router-dom';

interface SavedHostProps {
  hostname: string;
  mac: string;

  onWoken?: (hostname: string, mac: string) => void;
}

function SavedHost(props: SavedHostProps) {
  const history = useHistory();

  function handleHostItemClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    console.log('wol ' + props.mac);

    if (props.onWoken) {
      props.onWoken(props.hostname, props.mac);
    }
  }

  const editLink = '/edit/' + props.mac.replaceAll(':', '-');
  function handleHostItemEditClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    history.push(editLink);
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <li className="list-group-item list-group-item-action link-primary host-item" onClick={handleHostItemClick}>
      <div>
        <div className="fw-bold hostname">{props.hostname}</div>
        <div className="opacity-75">{props.mac}</div>
      </div>
      <div>
        <a href={editLink} className="link-secondary text-decoration-none edit-trigger" onClick={handleHostItemEditClick}>
          <i className="bi bi-pencil"></i>
        </a>
      </div>
    </li>
  );
}

export default SavedHost;

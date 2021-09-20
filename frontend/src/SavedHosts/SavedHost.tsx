import React from 'react';
import './SavedHost.css';

import { useHistory } from 'react-router-dom';

import API from '../API';
import { SettingsData } from 'wakeonlan-utilities';

interface SavedHostProps {
  hostname: string;
  mac: string;

  settings: SettingsData;

  onNewToastMessage: (message: React.ReactNode) => void;
}

function SavedHost(props: SavedHostProps) {
  const history = useHistory();

  function handleHostItemClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    API.wakeonlan(props.mac, props.settings.wolPort).then((result) => {
      onHostWoken(props.hostname, props.mac, result);
    });
  }

  function onHostWoken(hostname: string, mac: string, result: boolean) {
    let message = null;
    if (result) {
      message =
      <>
        Wake-on-LAN packet sent to:<br />
        {hostname}
      </>;
    } else {
      message =
      <>
        Failed to send Wake-on-LAN packet to:<br />
        {hostname}
      </>;
    }
    props.onNewToastMessage(message);
  }

  const editLink = '/edit/' + props.mac.replace(/:/g, '-');
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

import React from 'react';
import './SavedHost.css';

import { useHistory } from 'react-router-dom';

import { apiUri } from '../API';
import { SettingsData } from 'wakeonlan-utilities';

async function wakeonlan(mac: string, port: number): Promise<boolean> {
  let response;
  try {
    response = await fetch(apiUri + '/wakeonlan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mac: mac,
        port: port
      })
    });
  } catch (err) {
    return false;
  }
  if (!response.ok) {
    return false;
  }
  const responseObject = await response.json();
  if (!responseObject || !responseObject.result || responseObject.result !== true) {
    return false;
  }
  return true;
}

interface SavedHostProps {
  hostname: string;
  mac: string;

  settings: SettingsData;

  onNewToastMessage: (message: React.ReactNode) => void;
}

function SavedHost(props: SavedHostProps) {
  const history = useHistory();

  function handleHostItemClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    wakeonlan(props.mac, props.settings.wolPort).then((result) => {
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

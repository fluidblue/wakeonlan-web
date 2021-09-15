import React, { useContext } from 'react';
import './SavedHost.css';

import { useHistory } from 'react-router-dom';

import { API } from '../API';

interface SavedHostProps {
  hostname: string;
  mac: string;

  onWoken?: (hostname: string, mac: string, result: boolean) => void;
}

function SavedHost(props: SavedHostProps) {
  const history = useHistory();
  const api = useContext(API);

  async function wakeonlan(mac: string): Promise<boolean> {
    const response = await fetch(api + '/wakeonlan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mac: mac
        // TODO: Add port (and possibly address)
      })
    });
    if (!response.ok) {
      return false;
    }
    const responseObject = await response.json();
    if (!responseObject || !responseObject.result || responseObject.result !== true) {
      return false;
    }
    return true;
  }

  function handleHostItemClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    wakeonlan(props.mac).then((result) => {
      if (props.onWoken) {
        props.onWoken(props.hostname, props.mac, result);
      }
    });
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

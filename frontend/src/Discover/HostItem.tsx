import React from 'react';

import { Host } from 'wakeonlan-utilities';

interface HostProps {
  host: Host;
  onClick: (host: Host) => void;
}

function HostItem(props: HostProps) {
  function handleItemClick() {
    props.onClick(props.host);
  }

  return (
    <li className="list-group-item list-group-item-action link-primary host-item" onClick={handleItemClick}>
      <div>
        <div className="fw-bold">{props.host.name}</div>
        <div className="opacity-75">{props.host.mac}</div>
      </div>
    </li>
  );
}

export default HostItem;

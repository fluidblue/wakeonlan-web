import React from 'react';

interface HostProps {
  hostname: string;
  mac: string;
  handleItemClick: React.MouseEventHandler<HTMLLIElement>;
}

function HostItem(props: HostProps) {
  return (
    <li className="list-group-item list-group-item-action link-primary host-item" onClick={props.handleItemClick}>
      <div>
        <div className="fw-bold">{props.hostname}</div>
        <div className="opacity-75">{props.mac}</div>
      </div>
    </li>
  );
}

export default HostItem;

import React from 'react';
import './SavedHosts.css';

import { Link } from 'react-router-dom';

function SavedHosts() {
  return (
    <>
      <ul className="list-group">
        <li className="list-group-item list-group-item-action link-primary host-item">
          <div>
            <div className="fw-bold hostname">Hostname 1</div>
            <div className="opacity-75">00:11:22:33:44:55</div>
          </div>
          <div>
            <Link to="/edit/00-11-22-33-44-55" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </Link>
          </div>
        </li>
        <li className="list-group-item list-group-item-action link-primary host-item">
          <div>
            <div className="fw-bold hostname">Hostname 2</div>
            <div className="opacity-75">00:11:22:33:44:55</div>
          </div>
          <div>
            <Link to="/edit/00-11-22-33-44-55" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </Link>
          </div>
        </li>
        <li className="list-group-item list-group-item-action link-primary host-item">
          <div>
            <div className="fw-bold hostname">Hostname 3</div>
            <div className="opacity-75">00:11:22:33:44:55</div>
          </div>
          <div>
            <Link to="/edit/00-11-22-33-44-55" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </Link>
          </div>
        </li>
      </ul>

      <div className="btn-group dropup add">
        <button type="button" className="btn btn-primary rounded-circle dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,5" aria-expanded="false">
          <i className="bi bi-plus-lg"></i>
        </button>
        <ul className="dropdown-menu">
          <li><Link className="dropdown-item" to="/add">Manual</Link></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/discover">Automatic</Link></li>
        </ul>
      </div>
    </>
  );
}

export default SavedHosts;

import React from 'react';
import './SavedHosts.css';

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
            <a href="#edit-host-1" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </a>
          </div>
        </li>
        <li className="list-group-item list-group-item-action link-primary host-item">
          <div>
            <div className="fw-bold hostname">Hostname 2</div>
            <div className="opacity-75">00:11:22:33:44:55</div>
          </div>
          <div>
            <a href="#edit-host-2" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </a>
          </div>
        </li>
        <li className="list-group-item list-group-item-action link-primary host-item">
          <div>
            <div className="fw-bold hostname">Hostname 3</div>
            <div className="opacity-75">00:11:22:33:44:55</div>
          </div>
          <div>
            <a href="#edit-host-3" className="link-secondary text-decoration-none edit-trigger">
              <i className="bi bi-pencil"></i>
            </a>
          </div>
        </li>
      </ul>

      <div className="btn-group dropup add">
        <button type="button" className="btn btn-primary rounded-circle dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,5" aria-expanded="false">
          <i className="bi bi-plus-lg"></i>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#add-manual">Manual</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#add-automatic">Automatic</a></li>
        </ul>
      </div>
    </>
  );
}

export default SavedHosts;

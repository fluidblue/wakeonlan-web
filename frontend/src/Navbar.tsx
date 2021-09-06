import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand brand" href="#home">
          <i className="bi bi-power main-icon"></i>
          <h5>wakeonlan-web</h5>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse navbar-collapse-custom" id="navbarNavAltMarkup">
          <div className="navbar-nav navbar-nav-custom">
            <a className="nav-link active" aria-current="page" href="#savedhosts">
              <i className="bi bi-grid"></i>
              &nbsp;Saved hosts
            </a>
            <a className="nav-link" href="#discoverhosts">
              <i className="bi bi-wifi"></i>
              &nbsp;Discover hosts
            </a>
            <a className="nav-link" href="#settings">
              <i className="bi bi-gear"></i>
              &nbsp;Settings
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

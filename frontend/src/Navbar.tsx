import React from 'react';
import './Navbar.css';

import { NavLink} from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand brand" href=".">
          <i className="bi bi-power main-icon"></i>
          <h5>wakeonlan-web</h5>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse navbar-collapse-custom" id="navbarNavAltMarkup">
          <div className="navbar-nav navbar-nav-custom">
            <NavLink
              className="nav-link"
              activeClassName="active"
              aria-current="page"
              to="/hosts"
              isActive={(match, location) => {
                if (location && location.pathname && location.pathname === "/") {
                  return true;
                }
                return match ? true : false;
              }}
            >
              <i className="bi bi-grid"></i>
              &nbsp;Saved hosts
            </NavLink>
            <NavLink className="nav-link" activeClassName="active" aria-current="page" to="/discover">
              <i className="bi bi-wifi"></i>
              &nbsp;Discover hosts
            </NavLink>
            <NavLink className="nav-link" activeClassName="active" aria-current="page" to="/settings">
              <i className="bi bi-gear"></i>
              &nbsp;Settings
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';
import './Settings.css';

function Settings() {
  return (
    <div className="settings">
      <form>
        <h6 className="mb-3 fw-bold">Host discovery</h6>
        <div className="mb-3">
          <label htmlFor="inputNetwork" className="form-label">IP network</label>
          <input type="text" className="form-control" id="inputNetwork" value="192.168.178.0/24" placeholder="Enter network, e.g. 192.168.178.0/24" required disabled />
        </div>
        <div className="mb-3">
          <input className="form-check-input" type="checkbox" value="" id="checkboxAutoDetect" checked />
          &nbsp;
          <label className="form-check-label checkbox-fix" htmlFor="checkboxAutoDetect">Automatically detect network</label>
        </div>
        <div className="mb-3">
          <label htmlFor="selectMethod" className="form-label">Method</label>
          <select className="form-select" id="selectMethod">
            <option value="arp-scan" selected>arp-scan</option>
            <option value="arp-cache-and-ping">ARP cache and ping</option>
          </select>
        </div>
        <h6 className="mb-3 fw-bold">Wake on LAN</h6>
        <div className="mb-3">
          <label htmlFor="inputPort" className="form-label">UDP Port</label>
          <input type="text" className="form-control" id="inputPort" value="9" placeholder="Enter port number" required />
        </div>
        <hr />
        <div className="mb-3">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
        </form>
    </div>
  );
}

export default Settings;

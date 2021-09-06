import React from 'react';
import './ToastContainer.css';

function ToastContainer() {
  return (
    <div id="toastContainer" className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      <div id="toastWolPacketSent" className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">
            Wake-on-LAN packet sent to:<br />
            <span className="hostname"></span>
          </div>
          <button type="button" className="btn-close mt-2 me-2 mb-auto ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
}

export default ToastContainer;

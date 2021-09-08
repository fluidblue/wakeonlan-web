import React, { useCallback, useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';
import './ToastContainer.css';

import ToastWolPacketSent from './ToastWolPacketSent'

function ToastContainer() {
  const hostnames = [
    "Hostname 1",
    "Hostname 2",
    "Hostname 3"
  ];

  const toasts = hostnames.map((hostname) => {
    return <ToastWolPacketSent hostname={hostname} />;
  });

  return (
    <div id="toastContainer" className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      {toasts}
    </div>
  );
}

export default ToastContainer;

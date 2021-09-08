import React, { useCallback, useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';
import './ToastContainer.css';

interface ToastWolPacketSentProps {
  hostname: string;
}

function ToastWolPacketSent(props: ToastWolPacketSentProps) {
  const refToast = useRef<HTMLDivElement>(null);

  const showToast = useCallback(() => {
    if (refToast.current) {
      const element: Element = refToast.current;
      var toast = new Toast(element);
      toast.show();
    }
  }, []);

  useEffect(() => {
    showToast();
  }, [showToast]);

  return (
    <div ref={refToast} className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          Wake-on-LAN packet sent to:<br />
          {props.hostname}
        </div>
        <button type="button" className="btn-close mt-2 me-2 mb-auto ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  );
}

const hostnames = [
  "Hostname 1",
  "Hostname 2",
  "Hostname 3"
];

function ToastContainer() {
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

import React, { useCallback, useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

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

export default ToastWolPacketSent;

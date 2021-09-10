import './ToastContainer.css';

interface ToastContainerProps {
  children?: React.ReactNode;
}

function ToastContainer(props: ToastContainerProps) {
  return (
    <div id="toastContainer" className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      {props.children}
    </div>
  );
}

export default ToastContainer;

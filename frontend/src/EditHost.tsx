import React from 'react';
import { useHistory } from 'react-router';
import './EditHost.css';

interface EditHostProps {
  add?: boolean;

  id?: number;

  hostname?: string;
  mac?: string;
}

function EditHost(props: EditHostProps) {
  const history = useHistory();

  function handleCancelClick() {
    history.goBack();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert('Save');
  }

  const showDeleteButton = !props.add;
  let deleteButton = null;
  if (showDeleteButton) {
    deleteButton = <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete">Delete</button>;
  }

  const title = props.add ? "Save host" : "Edit host";

  return (
    <>
      <div className="modal fade" id="modalDelete" tabIndex={-1} aria-labelledby="modalDeleteLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalDeleteLabel">Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Do you really want to delete this host?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div className="edithost">
        <h6 className="mb-3 fw-bold">{title}</h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inputHostName" className="form-label">Hostname</label>
            <input type="text" className="form-control" id="inputHostName" value="Hostname 1" placeholder="Enter hostname" required />
          </div>
          <div className="mb-3">
            <label htmlFor="inputMacAddress" className="form-label">MAC address</label>
            <input type="text" className="form-control" id="inputMacAddress" value="00:11:22:33:44:55" placeholder="00:11:22:33:44:55" required />
          </div>
          <hr />
          <div className="mb-3">
            <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
          {deleteButton}
        </form>
      </div>
    </>
  );
}

export default EditHost;

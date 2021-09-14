import React, { createRef, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import './EditHost.css';

import { Modal } from 'bootstrap';

import NotFound from '../NotFound';

import Host from '../Host';
import { MACFunctions } from 'wakeonlan-utilities';

interface EditHostProps {
  add?: boolean;
  host?: Host | null;
  savedHosts: Host[];
  onSavedHostsChange: React.Dispatch<React.SetStateAction<Host[]>>;
}

interface Params {
  id: string;
}

function EditHost(props: EditHostProps) {
  const history = useHistory();
  const { id } = useParams<Params>();

  const inputHostName = createRef<HTMLInputElement>();
  const modalReplace = createRef<HTMLDivElement>();
  const modalDelete = createRef<HTMLDivElement>();

  const title = props.add ? "Save host" : "Edit host";
  const currentHost = props.add ? props.host : getHostById(id);

  const [hostname, setHostname] = useState(currentHost ? currentHost.name : '');
  const [mac, setMac] = useState(currentHost ? currentHost.mac : '');

  function getHostById(id: string) {
    const mac = id.replaceAll('-', ':');
    const host = props.savedHosts.find((item) => {
      return item.mac === mac;
    });
    if (!host) {
      return null;
    }
    return host;
  }

  function onCancelClick() {
    history.goBack();
  }

  function leavePage() {
    if (modalReplace.current) {
      const modal = Modal.getOrCreateInstance(modalReplace.current);
      modal.hide();
    }
    if (modalDelete.current) {
      const modal = Modal.getOrCreateInstance(modalDelete.current);
      modal.hide();
    }
    history.goBack();
  }

  function addCurrentHost(hosts: Host[]): Host[] {
    const hostsNew = hosts.slice();
    hostsNew.push({
      name: hostname,
      mac: mac
    });
    return hostsNew;
  }

  function removeCurrentHost(hosts: Host[]): Host[] {
    return hosts.filter((item) => {
      if (item.mac === mac) {
        return false;
      }
      return true;
    });
  }

  function replaceCurrentHost(hosts: Host[]): Host[] {
    hosts = removeCurrentHost(hosts);
    hosts = addCurrentHost(hosts);
    return hosts;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!hostname || !hostname.length || hostname.length < 1) {
      // Should not happen (due to constraints on html input element).
      // Ignore request silently.
      return;
    }

    if (!mac || !MACFunctions.isValidMac(mac)) {
      // Should not happen (due to constraints on html input element).
      // Ignore request silently.
      return;
    }

    if (props.add) {
      // Check for duplicate item
      if (props.savedHosts.find((item) => {
        return (item.mac === mac);
      })) {
        const modal = Modal.getOrCreateInstance(modalReplace.current!);
        modal.show();
        return;
      }

      // Add host and update prop
      const savedHostsNew = addCurrentHost(props.savedHosts);
      props.onSavedHostsChange(savedHostsNew);
    } else {
      // Replace without asking in edit mode.

      // Replace host and update prop
      let savedHostsNew = replaceCurrentHost(props.savedHosts);
      props.onSavedHostsChange(savedHostsNew);
    }

    leavePage();
  }

  function onModalReplaceYesClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // Replace host and update prop
    let savedHostsNew = replaceCurrentHost(props.savedHosts);
    props.onSavedHostsChange(savedHostsNew);

    leavePage();
  }

  function onModalDeleteConfirm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // Remove old host and update prop
    let savedHostsNew = removeCurrentHost(props.savedHosts);
    props.onSavedHostsChange(savedHostsNew);

    leavePage();
  }

  const showDeleteButton = !props.add;
  let deleteButton = null;
  if (showDeleteButton) {
    deleteButton = (
      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#modalDelete"
      >
        Delete
      </button>
    );
  }

  useEffect(() => {
    if (inputHostName.current && hostname.length === 0) {
      inputHostName.current.focus();
    }
  }, [inputHostName, hostname]);

  if (!props.add && !currentHost) {
    return <NotFound />;
  }

  return (
    <>
      <div className="modal fade" id="modalDelete" tabIndex={-1} aria-labelledby="modalDeleteLabel" aria-hidden="true" ref={modalDelete}>
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
              <button type="button" className="btn btn-danger" onClick={onModalDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalReplace" tabIndex={-1} aria-labelledby="modalReplaceLabel" aria-hidden="true" ref={modalReplace}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalReplaceLabel">Replace?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              A host with this MAC address has already been saved.<br />
              Should wakeonlan-web replace the existing entry?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-primary" onClick={onModalReplaceYesClick}>Yes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="edithost">
        <h6 className="mb-3 fw-bold">{title}</h6>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="inputHostName" className="form-label">Hostname</label>
            <input
              type="text"
              className="form-control"
              id="inputHostName"
              ref={inputHostName}
              value={hostname}
              onChange={(e) => { setHostname(e.target.value); }}
              placeholder="Enter hostname"
              required
              minLength={1}
              maxLength={255}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputMacAddress" className="form-label">MAC address</label>
            <input
              type="text"
              className="form-control"
              id="inputMacAddress"
              value={mac}
              onChange={(e) => { setMac(e.target.value); }}
              placeholder="00:11:22:33:44:55"
              required
              pattern={MACFunctions.RE_MAC.source}
              disabled={!props.add}
            />
          </div>
          <hr />
          <div className="mb-3">
            <button type="button" className="btn btn-secondary" onClick={onCancelClick}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
          {deleteButton}
        </form>
      </div>
    </>
  );
}

export default EditHost;

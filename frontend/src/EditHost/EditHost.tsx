import React, { createRef, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import './EditHost.css';

import { Modal } from 'bootstrap';

import NotFound from '../NotFound';

import { MACFunctions, Host } from 'wakeonlan-utilities';
import API from '../API';

interface EditHostProps {
  add?: boolean;
  host?: Host | null;

  savedHosts: Host[];
  onSavedHostsChange: React.Dispatch<React.SetStateAction<Host[]>>;

  onNewToastMessage: (message: React.ReactNode) => void;
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
    const mac = id.replace(/-/g, ':');
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

  function hostSaved(mac: string): boolean {
    return props.savedHosts.find((item) => {
      return (item.mac === mac);
    }) ? true : false;
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
      if (hostSaved(mac)) {
        const modal = Modal.getOrCreateInstance(modalReplace.current!);
        modal.show();
        return;
      }
    }

    onSubmitContinued();
  }

  async function onSubmitContinued() {
    // Add (or replace) host on server
    const host: Host = {
      name: hostname,
      mac: mac
    };
    if (!await API.addHost(host)) {
      onHostSaved(false);
      return;
    }

    // Add or replace host in array and save to prop
    let savedHostsNew;
    if (hostSaved(mac)) {
      savedHostsNew = replaceCurrentHost(props.savedHosts);
    } else {
      savedHostsNew = addCurrentHost(props.savedHosts);
    }
    props.onSavedHostsChange(savedHostsNew);

    leavePage();
    onHostSaved(true);
  }

  function onHostSaved(result: boolean) {
    const text = result ? 'The host has been saved.' : 'The host could not be saved.';
    props.onNewToastMessage(text);
  }

  function onModalReplaceYesClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSubmitContinued();
  }

  async function onModalDeleteConfirm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // Delete host on server
    if (!await API.removeHost(mac)) {
      onHostRemoved(false);
      return;
    }
    
    // Remove old host and update prop
    let savedHostsNew = removeCurrentHost(props.savedHosts);
    props.onSavedHostsChange(savedHostsNew);

    leavePage();
    onHostRemoved(true);
  }

  function onHostRemoved(result: boolean) {
    const text = result ? 'The host has been removed.' : 'The host could not be removed.';
    props.onNewToastMessage(text);
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

  const inputHostNameCurrent = inputHostName.current;
  useEffect(() => {
    if (inputHostNameCurrent && hostname.length === 0) {
      inputHostNameCurrent.focus();
    }
  }, [inputHostNameCurrent, hostname]);

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
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onModalDeleteConfirm}>Delete</button>
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
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onModalReplaceYesClick}>Yes</button>
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

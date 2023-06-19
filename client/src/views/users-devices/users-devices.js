import React, { useState, useEffect, useRef } from 'react'
import DeviceService from '../../services/device-service';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import TableLoader from '../../components/table-loader/table-loader';

function UsersDevices() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState(() => []);
  const [pending, setPending] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const newDeviceID = useRef('');
  const latitudeDevice = useRef();
  const longitudeDevice = useRef();
  const [idDeviceToDelete, setIdDeviceToDelete] = useState();
  const [idDeviceToEdit, setIdDeviceToEdit] = useState();
  const [latitudeState, setLatitudeState] = useState();
  const [longitudeState, setLongitudeState] = useState();

  const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openAddModal = () => {
    setShowAddModal(true);
  }
  const closeAddModal = () => {
    setShowAddModal(false);
  }

  const openCoordinatesModal = () => {
    setShowCoordinatesModal(true);
  }
  const closeCoordinatesModal = () => {
    setShowCoordinatesModal(false);
  }
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  }
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  }

  const addNewDevice = async () => {
    closeAddModal();
    const resp = await DeviceService.newDevice(newDeviceID.current.value);
    if (resp.data.error) {
      toast.error(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
    } else {
      toast.success(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
      loadDevices();
    }
  }

  const deleteDevice = async () => {
    closeDeleteModal();
    const resp = await DeviceService.deleteDevice(idDeviceToDelete);
    if (resp.data.error) {
      toast.error(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
    } else {
      toast.success(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
      loadDevices();
    }
  }

  const editDevice = async () => {
    closeCoordinatesModal();
    const resp = await DeviceService.editDevice(idDeviceToEdit, latitudeDevice.current.value, longitudeDevice.current.value);
    if (resp.data.error) {
      toast.error(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
    } else {
      toast.success(resp.data.msg, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
      loadDevices();
    }
  }

  const loadDevices = () => {
    DeviceService.getAdminAllDevices().then((response) => {
      const sensors = response.data.sensors ? response.data.sensors : [];
      const auxcolumns = [];
      if (sensors.length > 0) {
        for (let key in sensors[0]) {
          if (key == "__v" || key == "_id" || key == "idUser" || key == "userInfo") {
            continue;
          }
          auxcolumns.push({
            name: key,
            selector: row => row[key],
            sortable: true,
            reorder: true
          });

        }
      }

      auxcolumns.push({
        name: "Actions",
        grow: 2,
        center: true,
        compact: true,
        //button: true,
        cell: (row) => {
          return <>
            <div class="btn-group">
              <button type="button" class="btn btn-primary btn-sm btn-addon" onClick={() => {
                navigate(row.idSensor);
              }} ><i class="ti-info" ></i>Show Info</button>
              <button type="button" class="btn btn-warning btn-sm btn-addon" onClick={() => {
                setIdDeviceToEdit(row.idSensor);
                setLatitudeState(row.latitude);
                setLongitudeState(row.longitude);
                openCoordinatesModal();
              }} ><i class="ti-pencil-alt" ></i>Edit</button>
              <button type="button" class="btn btn-danger btn-sm btn-addon" onClick={() => {
                setIdDeviceToDelete(row.idSensor);
                openDeleteModal();
              }} ><i class="ti-trash" ></i>Delete</button>
            </div>
          </>
        }

      });
      setColumns(auxcolumns);
      setData(sensors);
      setPending(false);
    });
  }



  useEffect(
    () => {
      loadDevices();
    }, [])


  return (
    <>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="bootstrap-data-table-panel">
              <div class="table-responsive">
                <DataTable columns={columns} data={data} pagination progressPending={pending} progressComponent={<TableLoader />} title="Devices" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Modal show={showAddModal} onHide={closeAddModal}>
        <Modal.Header>
          <Modal.Title>Aggiungi Nuovo Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>ID Dispositivo: <input type='text' ref={newDeviceID} /></Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-secondary" onClick={closeAddModal}>Chiudi</button>
          <button type="button" class="btn btn-primary" onClick={addNewDevice}>Aggiungi</button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCoordinatesModal} onHide={closeCoordinatesModal}>
        <Modal.Header>
          <Modal.Title>Coordinate Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Latitudine: <input type='number' ref={latitudeDevice} value={latitudeState} />
          Longitudine: <input type='number' ref={longitudeDevice} value={longitudeState} />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-secondary" onClick={closeCoordinatesModal}>Chiudi</button>
          <button type="button" class="btn btn-primary" onClick={editDevice}>Salva</button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header>
          <Modal.Title>Elimina Dispositivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sicuro di voler eliminare il dispositivo?</Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-secondary" onClick={closeDeleteModal}>Chiudi</button>
          <button type="button" class="btn btn-primary" onClick={deleteDevice}>Elimina</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UsersDevices
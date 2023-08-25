import React, { useState, useEffect, useRef } from 'react'
import UserService from '../../services/user-service'
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import AuthService from '../../services/auth-service';
import { useParams, useNavigate } from 'react-router-dom';
import DeviceService from '../../services/device-service';
import DataTable from 'react-data-table-component';

function UserInfo() {
  // memorizza lo stato delle informazioni utente
  const [userInfo, setUserInfo] = useState({
    username: "",
    level: "",
    email: ""
  });

  const role = useRef();
  const { idUser } = useParams();

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState(() => []);
  const [pending, setPending] = useState(true);

  const [showEditRole, setShowEditRole] = useState(false);
  const navigate = useNavigate();

  const openEditRole = () => {
    setShowEditRole(true);
  }
  const closeEditRole = () => {
    setShowEditRole(false);
  }

  const loadDevices = () => {
    DeviceService.getDevicesByUser(idUser).then((response) => {
      const sensors = response.data.sensors?response.data.sensors:[];
      const auxcolumns = [];
      if (sensors.length > 0) {
        for (let key in sensors[0]) {
          if (key == "__v" || key == "_id" || key == "idUser") {
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
        //button: true,
        cell: (row) => {
          return <>
            <button type="button" class="btn btn-primary btn-sm btn-addon" onClick={() => {
              navigate("../users-devices/"+row.idSensor);
            }} ><i class="ti-info" ></i>Show Info</button>
          </>
        }

      });
      setColumns(auxcolumns);
      setData(sensors);
      setPending(false);
    });
  }

  const modifyRole = async () => {
    // controllo lato client delle password inserite se sono uguali
    closeEditRole();
    const resp = await AuthService.changeRole(idUser,role.current.value);
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
      getUserInfo();
    }
  }

  const getUserInfo = async () => {
    const resp = (await UserService.getUserInfo(idUser)).data.user;
    setUserInfo(resp);
  }

  // aggiorna il DOM con la funzione restituita
  useEffect(() => {
    getUserInfo();
    loadDevices();
  }, [])
  return (
    <>
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <div class="user-profile">
                <div class="row">
                  <div class="col-lg-4">
                    <div class="user-photo m-b-30">
                      <img class="img-fluid" src="images/user-profile.jpg" alt="" />
                    </div>
                    <div class="user-work">
                      <h4>Information</h4>
                      <div class="work-content">
                        <h3>Email:</h3>
                        <p>{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="user-profile-name">{userInfo.username}</div>
                    <div class="user-job-title">{userInfo.level}</div>

                    <div class="user-send-message">
                      <button class="btn btn-warning btn-addon" type="button" onClick={openEditRole}>
                        <i class="ti-settings" ></i>Change Role</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="bootstrap-data-table-panel">
              <div class="table-responsive">
                <DataTable columns={columns} data={data} pagination progressPending={pending} title="Devices" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      <Modal show={showEditRole} onHide={closeEditRole}>
        <Modal.Header>
          <Modal.Title>Modify Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Role: <select defaultValue={userInfo.level} ref={role}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-secondary" onClick={closeEditRole}>Close</button>
          <button type="button" class="btn btn-primary" onClick={modifyRole}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserInfo
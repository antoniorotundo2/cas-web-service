import React, { useState, useEffect, useRef } from 'react'
import UserService from '../../services/user-service'
//inizio codice aggiunto
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import AuthService from '../../services/auth-service';
// fine codice aggiunto

function Profile() {
  // memorizza lo stato delle informazioni utente
  const [userInfo, setUserInfo] = useState({
    username: "",
    level: "",
    email: ""
  });

  const newPassword = useRef();
  const repeatNewPassword = useRef();

  //inizio codice aggiunto
  const [showModifyPasswordModal, setShowModifyPasswordModal] = useState(false);

  const openModifyPasswordModal = () => {
    setShowModifyPasswordModal(true);
  }
  const closeModifyPasswordModal = () => {
    setShowModifyPasswordModal(false);
  }

  const modifyPassword = async () => {
    // controllo lato client delle password inserite se sono uguali
    if (newPassword.current.value != repeatNewPassword.current.value) {
      toast.error('password are not the same', {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'dark'
      });
      return;
    }
    closeModifyPasswordModal();
    const resp = await AuthService.changePassword(newPassword.current.value, repeatNewPassword.current.value);
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
    }
  }
  // fine codice aggiunto

  const getUserInfo = async () => {
    const resp = (await UserService.getMe()).data.data;
    setUserInfo(resp);
  }

  // aggiorna il DOM con la funzione restituita
  useEffect(() => {
    getUserInfo();
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
                      <button class="btn btn-primary btn-addon" type="button" onClick={openModifyPasswordModal}>
                        <i class="ti-email" ></i>Change Password</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* inizio codice aggiunto */}
      <ToastContainer />
      <Modal show={showModifyPasswordModal} onHide={closeModifyPasswordModal}>
        <Modal.Header>
          <Modal.Title>Modifica Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Nuova Password: <input type='password' ref={newPassword} /> <br/>
          Ripeti Nuova Password: <input type='password' ref={repeatNewPassword} />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-secondary" onClick={closeModifyPasswordModal}>Chiudi</button>
          <button type="button" class="btn btn-primary" onClick={modifyPassword}>Salva</button>
        </Modal.Footer>
      </Modal>
      {/* fine codice aggiunto */}
    </>
  )
}

export default Profile
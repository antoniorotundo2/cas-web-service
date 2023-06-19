import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthService from '../../services/auth-service';
import { useNavigate } from 'react-router-dom';

function Login() {
  const emailInput = useRef();
  const passwordInput = useRef();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitForm = async (event) => {
    event.preventDefault();
    console.log(process.env.NODE_ENV);
    setErrorMessage("");
    const resp = await AuthService.login(emailInput.current.value, passwordInput.current.value);
    if (resp.statusText != "OK") {
      setErrorMessage("An error as occured");
      return;
    }
    if (resp.data && resp.data.error) {
      setErrorMessage(resp.data.msg);
      return;
    }
    navigate("/admin");
  }

  const errorAlert = () => {
    if (errorMessage) {
      return <div class="alert alert-danger">
        {errorMessage}
      </div>
    } else {
      return <></>;
    }
  }

  return (
    <>
      <div class="unix-login">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="login-content">
                <div class="login-form">
                  <h4>Login to Chirp Air Station</h4>
                  <form onSubmit={onSubmitForm}>
                    {errorAlert()}
                    <div class="form-group">
                      <label>Email address</label>
                      <input type="email" class="form-control" placeholder="Email" ref={emailInput} />
                    </div>
                    <div class="form-group">
                      <label>Password</label>
                      <input type="password" class="form-control" placeholder="Password" ref={passwordInput} />
                    </div>
                    <button type="submit" class="btn btn-primary btn-flat m-b-30 m-t-30">Sign in</button>
                    <div class="register-link m-t-15 text-center">
                      <p>Don't have account ? <Link to="/register">Sign Up Here</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
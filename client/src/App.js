import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Admin from "./layouts/admin/admin";
import Frontend from "./layouts/frontend/frontend";
import Dashboard from "./views/dashboard/dashboard";
import Login from "./views/login/login";
import Register from "./views/register/register";
import Devices from "./views/devices/devices";
import NotFound from "./views/404/404";
import UsersDevices from "./views/users-devices/users-devices";
import Device from "./views/device/device";
import Users from "./views/users/users";
import Profile from "./views/profile/profile";
import UserInfo from "./views/user-info/user-info";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="devices" element={<Devices />} />
          <Route path="devices/:idSensor" element={<Device />} />
          <Route path="users-devices" element={<UsersDevices />} />
          <Route path="users-devices/:idSensor" element={<Device />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:idUser" element={<UserInfo />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/" element={<Frontend />} >
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

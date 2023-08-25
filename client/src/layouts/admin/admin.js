import React from 'react'
import { Outlet, Link } from "react-router-dom";
import Menu from '../../components/menu/menu';
import Header from '../../components/header/header';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import sidebar from "../../assets/js/lib/menubar/sidebar";
import AuthService from '../../services/auth-service';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/user-service';

function Admin() {
    const [userInfo, setUserInfo] = useState({ username: "", level: "user" });
    const navigate = useNavigate();

    const logout = async (event) => {
        event.preventDefault();
        const resp = await AuthService.logout();
        navigate("/");
    }

    const checkLogin = async () => {
        const resp = await UserService.checkLogin();
        if (resp.data.error) {
            navigate("/");
        } else {
            setUserInfo(resp.data.data);
        }
    }

    const getAdminMenu = () => {
        if (userInfo.level == "admin") {
            return <>
                <li class="label">Admin</li>
                <li>
                    <Link to="users"><i class="bx bx-user"></i> Users</Link>
                </li>
                <li>
                    <Link to="users-devices"><i class="bx bx-microchip"></i> Devices</Link>
                </li></>
        } else { return <></> }
    }

    const options = sidebar.DEFAULTS;   
    // $.extend({}, sidebar.DEFAULTS, $(this).data(), typeof option == 'object' && option);
    let cursidebar;
    // viene aggiornata ogni qualvolta quella dipendenza [..] viene modificata
    useEffect(() => {
        $('.sidebar').each(function () {
            cursidebar = new sidebar(this, options);
        });
        checkLogin();
    }, [cursidebar]);

    const togglesidebar = () => {
        // console.log(cursidebar);
        // cursidebar.togglesidebar();
    }
    return (<>
        <div class="sidebar sidebar-hide-to-small sidebar-shrink sidebar-gestures">
            <div class="nano">
                <div class="nano-content">
                    <ul>
                        <div class="logo"><a href="index.html">
                            <span>Chirp Air Station</span></a></div>
                        <li class="label">Menu</li>
                        <li>
                            <Link to="/admin"><i class="bx bxs-dashboard"></i> Dashboard</Link>
                        </li>
                        <li>
                            <Link to="devices"><i class="bx bx-microchip"></i> Devices {/*<span class="badge badge-primary">2</span>*/}</Link>
                        </li>
                        <li>
                            <Link to="profile"><i class="bx bxs-user-detail"></i> Profile</Link>
                        </li>

                        {getAdminMenu()}

                        <li><a href='#' onClick={logout}><i class='bx bx-log-out'></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="float-left">
                            <div class="hamburger sidebar-toggle" onClick={togglesidebar}>
                                <span class="line"></span>
                                <span class="line"></span>
                                <span class="line"></span>
                            </div>
                        </div>
                        <div class="float-right">
                            <div class="dropdown dib">
                                <div class="header-icon">
                                    <span class="user-avatar">Bentornato, {userInfo.username}

                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-wrap">
            <div class="main">
                <div class="container-fluid">
                    <section id="main-content">

                        <Outlet />
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="footer">
                                    <p>2023 © Chirp Air Station.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </>
    )
}

export default Admin
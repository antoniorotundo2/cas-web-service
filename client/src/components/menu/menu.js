import React from 'react'

function Menu() {
    return (
        <div class="sidebar sidebar-hide-to-small sidebar-shrink sidebar-gestures">
            <div class="nano">
                <div class="nano-content">
                    <ul>
                        <div class="logo"><a href="index.html">
                            <span>Chirp Air Station</span></a></div>
                        <li class="label">Menu</li>
                        <li>
                            <a href="#" class="sidebar-sub-toggle"><i class="ti-home"></i> Dashboard</a>
                        </li>
                        <li>
                            <a href="#" class="sidebar-sub-toggle"><i class="ti-home"></i> Devices <span class="badge badge-primary">2</span></a>
                        </li>
                        <li>
                            <a href="#" class="sidebar-sub-toggle"><i class="ti-home"></i> Profile</a>
                        </li>

                        <li class="label">Admin</li>
                        <li>
                            <a href="#" class="sidebar-sub-toggle"><i class="ti-home"></i> Users</a>
                        </li>
                        <li>
                            <a href="#" class="sidebar-sub-toggle"><i class="ti-home"></i> Devices</a>
                        </li>

                        <li><a><i class="ti-close"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Menu
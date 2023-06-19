import { getAllDevices, getDeviceInfo } from "./device-service";

const getHost = ()=>{
    if(!process.env.NODE_ENV || process.env.NODE_ENV=="development"){
        return "//localhost:8080/";
    } else {
        return "";
    }
} 

const AuthEndpoints = {
    login:getHost()+"user/login",
    register:getHost()+"user/register",
    logout:getHost()+"user/logout",
    me:getHost()+"user/me",
    changePassword:getHost()+"user/password",
    root:getHost()+"user/"
}

const DeviceEndpoints = {
    getAdminAllDevices:getHost()+"sensor/all",
    getAllDevices:getHost()+"sensor",
    getDevice:getHost()+"sensor/",
    getDevicesByUser:getHost()+"sensor/user/"
}

const ReadEndpoints = {
    getAllRead:getHost()+"reads/"
}

const UserEndpoints = {
    getAllUsers:getHost()+"user/",
    getUserInfo:getHost()+"user/"
}

export {AuthEndpoints, DeviceEndpoints, ReadEndpoints, UserEndpoints, getHost}
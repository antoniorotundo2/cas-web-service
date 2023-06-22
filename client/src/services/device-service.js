import { DeviceEndpoints } from "./endpoints";
import axios from "axios";

export default {
    getAdminAllDevices: async () => {
        return await axios.get(DeviceEndpoints.getAdminAllDevices, { withCredentials: true });
    },
    getAllDevices: async () => {
        return await axios.get(DeviceEndpoints.getAllDevices, { withCredentials: true });
    },
    getDevice: async (idSensor) => {
        return await axios.get(DeviceEndpoints.getDevice + idSensor, { withCredentials: true });
    },
    newDevice: async (idSensor) => {
        return await axios.post(DeviceEndpoints.getDevice, { idSensor: idSensor }, { withCredentials: true });
    },
    deleteDevice: async (idSensor) => {
        return await axios.delete(DeviceEndpoints.getDevice + idSensor, { withCredentials: true });
    },
    editDevice: async (idSensor, latitude, longitude) => {
        return await axios.put(DeviceEndpoints.getDevice + idSensor, { latitude: latitude, longitude: longitude }, { withCredentials: true });
    },
    getDevicesByUser: async (idUser) => {
        return await axios.get(DeviceEndpoints.getDevicesByUser + idUser, { withCredentials: true });
    },
    getDevicesDashboard: async() =>{
        return await axios.get(DeviceEndpoints.getDevicesDashboard, { withCredentials: true });
    }
}
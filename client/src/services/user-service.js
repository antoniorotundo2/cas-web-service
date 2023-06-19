import { AuthEndpoints, UserEndpoints } from "./endpoints";
import axios from "axios";

export default {
    checkLogin:async() => {
        return await axios.get(AuthEndpoints.me, {withCredentials:true});
    },
    getAllUsers:async() => {
        return await axios.get(UserEndpoints.getAllUsers, {withCredentials:true});
    },
    getMe:async() => {
        return await axios.get(AuthEndpoints.me, {withCredentials:true});
    },
    getUserInfo:async(idUser) =>{
        return await axios.get(UserEndpoints.getUserInfo+idUser, {withCredentials:true});
    }
}
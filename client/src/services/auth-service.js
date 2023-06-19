import { AuthEndpoints } from "./endpoints";
import axios from "axios";

export default {
    login:async(email,password)=>{
        return await axios.post(AuthEndpoints.login,{email,password}, {withCredentials:true})
    },
    register:async(username,email,password)=>{
        return await axios.post(AuthEndpoints.register,{username,email,password})
    },
    logout:async()=>{
        return await axios.get(AuthEndpoints.logout, {withCredentials:true})
    },
    // non avendo indicato la coppia chiave:valore dell'oggetto, si assume che il nome della chiave coincida con quello della variabile stessa
    changePassword:async(newPassword,repeatNewPassword)=>{
        return await axios.put(AuthEndpoints.changePassword,{newPassword,repeatNewPassword}, {withCredentials:true})
    },
    changeRole:async(idUser,role) => {
        return await axios.put(AuthEndpoints.root+idUser+"/role", {newRole:role}, {withCredentials:true})
    }
}
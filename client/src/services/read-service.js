import { ReadEndpoints } from "./endpoints";
import axios from "axios";

export default {
    getAllRead: async (idSensor) => {
        return await axios.get(ReadEndpoints.getAllRead + idSensor, { withCredentials: true });
    }
}
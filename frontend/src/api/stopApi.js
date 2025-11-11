
//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/stop";

export const getStopsApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách các route
}
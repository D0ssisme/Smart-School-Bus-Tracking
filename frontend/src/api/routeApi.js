
//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/route";

export const getRoutesApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách các route
};


//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/route-stop";

export const getRoutesStopApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách các route
};


export const getRoutesByIdApi = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data; // danh sách các route
};



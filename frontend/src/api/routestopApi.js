
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

export const createRouteStopApi = async (routeData) => {
    const res = await axios.post(`${API_URL}`, routeData);
    return res.data; // thông tin route mới tạo
}
export const updateRouteStopApi = async (routeId, routeData) => {
    const res = await axios.put(`${API_URL}/${routeId}`, routeData);
    return res.data; // thông tin route đã cập nhật
}
export const deleteRouteStopApi = async (routeId) => {
    const res = await axios.delete(`${API_URL}/${routeId}`);
    return res.data; // thông tin route đã bị xóa
}




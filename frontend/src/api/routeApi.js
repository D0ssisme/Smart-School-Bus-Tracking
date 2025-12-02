
//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/route";

export const getRoutesApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách các route
};
export const getRoutesByIdApi = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data; // danh sách các route
}

// Gửi request để tự động tạo route kèm stops
export const createRouteAutoApi = async (routeData) => {
  const res = await axios.post(`${API_URL}/auto`, routeData);
  return res.data; // thông tin route mới tạo
};

export const updateRouteApi = async (routeId, routeData) => {
    const res = await axios.put(`${API_URL}/${routeId}`, routeData);
    return res.data; // thông tin route đã cập nhật
}
export const deleteRouteApi = async (routeId) => {

    const res = await axios.delete(`${API_URL}/${routeId}`);
    return res.data; // thông tin route đã bị xóa
}

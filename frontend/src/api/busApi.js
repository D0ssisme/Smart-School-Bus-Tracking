import axios from "axios";
const API_URL = "http://localhost:8080/api/bus";
export const getAllBuses = async () => {
    const res = await axios.get("http://localhost:8080/api/bus");
    return res.data; // vì response là mảng [] nên trả về luôn
};
//src/api/busApi.js


// Ví dụ trong busApi.js
export const createBusApi = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data; // ← Xem cái này trả về gì
};

export const updateBusApi = async (busId, data) => {
    const response = await axios.put(`${API_URL}/${busId}`, data);
    return response.data;
};
export const deleteBusApi = async (busId) => {
    const response = await axios.delete(`${API_URL}/${busId}`);
    return response.data;
};
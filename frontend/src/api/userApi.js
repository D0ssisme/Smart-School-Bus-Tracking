import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

export const getDriversApi = async () => {
    const res = await axios.get(`${API_URL}/driver`);
    return res.data; // danh sách các driver
};

export const getParentsApi = async () => {
    const res = await axios.get(`${API_URL}/parent`);
    return res.data; // danh sách các phụ huynh
};

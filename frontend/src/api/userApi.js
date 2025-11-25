import axios from "axios";

const API_URL = "http://localhost:8080/api/user";
export const getAllUsersApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách tất cả người dùng
}

export const getDriversApi = async () => {
    const res = await axios.get(`${API_URL}/driver`);
    return res.data; // danh sách các driver
};

export const getParentsApi = async () => {
    const res = await axios.get(`${API_URL}/parent`);
    return res.data; // danh sách các phụ huynh
};
export const createUserApi = async (userData) => {
    // Endpoint giả định: POST tới /api/user
    const res = await axios.post(API_URL, userData); 
    return res.data; 
};

export const updateUserApi = async (userId, updatedData) => {
    const res = await axios.put(`${API_URL}/${userId}`, updatedData);
    return res.data; 
}

export const deleteUserApi = async (userId) => {
    const res = await axios.delete(`${API_URL}/${userId}`);
    return res.data; 
};
// userApi.js
export const getUserByIdApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log("📌 API Response:", response.data);
    
    // ✅ Trả về response.data.user (vì API wrap trong object)
    return response.data.user;
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    throw error;
  }
};
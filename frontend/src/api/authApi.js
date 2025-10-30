// src/api/authApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const loginApi = async (phoneNumber, password) => {
  const res = await axios.post(`${BASE_URL}/login`, { phoneNumber, password });
  return res.data;
};
    
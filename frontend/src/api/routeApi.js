
//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/route";

export const getRoutesApi = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data; // danh sách các route
};

// Gửi request để tự động tạo route kèm stops
export const createRouteAutoApi = async (routeData) => {
  const res = await axios.post(`${API_URL}/auto`, routeData);
  return res.data; // thông tin route mới tạo
};
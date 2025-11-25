import axios from "axios";

const BASE_URL = "http://localhost:8080/api/bus-locations";

export const getCurrentBusLocation = async (busId) => {
    const res = await axios.get(`${BASE_URL}/${busId}`);
    return res.data;
};

export const getBusLocationHistory = async (busId, limit = 100) => {
    const res = await axios.get(`${BASE_URL}/${busId}/history?limit=${limit}`);
    return res.data;
};
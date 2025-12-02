import axios from "axios";

const API_URL = "http://localhost:8080/api/busschedule";

export const getAllBuschedule = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const createBusScheduleApi = async (scheduleData) => {
    console.log("📤 Sending to /busschedule:", scheduleData);
    const res = await axios.post(API_URL, scheduleData);
    return res.data;
};

export const updateBusScheduleApi = async (id, scheduleData) => {
    console.log("📤 Updating schedule:", id, scheduleData);
    const res = await axios.put(`${API_URL}/${id}`, scheduleData);
    console.log("✅ Update response:", res.data);
    return res.data;
};

export const deleteBusScheduleApi = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

export const getBusScheduleByDriverIdApi = async (driverId) => {
    const res = await axios.get(`${API_URL}/driver/${driverId}`);
    return res.data;
};

export const getBusScheduleByRoute = async (routeId) => {
    const res = await axios.get(`${API_URL}/by-route/${routeId}`);
    return res.data;
};

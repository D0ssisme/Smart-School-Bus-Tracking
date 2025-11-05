//src/api/busscheduleApi.js
import axios from "axios";
const API_URL = "http://localhost:8080/api/busschedule";
export const getAllBuschedule = async () => {
    const res = await axios.get("http://localhost:8080/api/busschedule");
    return res.data; // vì response là mảng [] nên trả về luôn
};

export const createBusScheduleApi = async (scheduleData) => {
    console.log("📤 Sending to /busschedule:", scheduleData);

    // ✅ Gửi thẳng, không transform
    const res = await axios.post(API_URL, scheduleData);
    return res.data;
};

export const updateBusScheduleApi = async (id, scheduleData) => {
    const res = await axios.put(`${API_URL}/${id}`, scheduleData);
    return res.data;
};

export const deleteBusScheduleApi = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};   

export const getBusScheduleByDriverIdApi = async (driverId) => {
    const res = await axios.get(`${API_URL}/driver/${driverId}`);
    return res.data;
}
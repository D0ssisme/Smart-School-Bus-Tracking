//src/api/busscheduleApi.js
import axios from "axios";
const API_URL = "http://localhost:8080/api/busschedule";
export const getAllBuschedule = async () => {
    const res = await axios.get("http://localhost:8080/api/busschedule");
    return res.data; // vì response là mảng [] nên trả về luôn
};

export const createBusScheduleApi = async (scheduleData) => {
    const res = await axios.post(API_URL, {
        bus_id: scheduleData.busId,
        driver_id: scheduleData.driverId,
        route_id: scheduleData.routeId,
        start_time: scheduleData.startTime,
        end_time: scheduleData.endTime,
        status: scheduleData.status || "scheduled"
    });
    return res.data;
};
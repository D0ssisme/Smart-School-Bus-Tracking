import axios from "axios";
const API_URL = "http://localhost:8080/api/bus"; 
export const getAllBuses = async () => {
    const res = await axios.get("http://localhost:8080/api/bus");
    return res.data; // vì response là mảng [] nên trả về luôn
};
//src/api/busApi.js


export const createBusApi = async (busData) => {
    const res = await axios.post(API_URL, {
        license_plate: busData.plate,
        capacity: busData.capacity,
        status: busData.status || "active"
    });
    return res.data;
};
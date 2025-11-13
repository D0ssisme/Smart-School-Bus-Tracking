
//src/api/routeApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/incidentreports";

export const getAllIncidentReports = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data;
};

export const createIncidentReportApi = async (reportData) => {
    const res = await axios.post(`${API_URL}`, reportData);
    return res.data;
}
export const updateIncidentReportApi = async (id, reportData) => {
    const res = await axios.put(`${API_URL}/${id}`, reportData);
    return res.data;
}
export const deleteIncidentReportApi = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
}   
import axios from "axios";

const API_URL = "http://localhost:8080/api/studentbusassignments";

export const getAllStudentBusAssignments = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getStudentBusAssignmentById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const getStudentBusAssignmentByStudentId = async (studentId) => {
    const res = await axios.get(`${API_URL}/student/${studentId}`);
    return res.data;
};

export const getCountStudentByScheduleId = async (scheduleId) => {
    const res = await axios.get(`${API_URL}/schedule/${scheduleId}/count`);
    return res.data;
};

export const deleteStudentBusAssignment = async (assignmentId) => {
    const res = await axios.delete(`${API_URL}/${assignmentId}`);
    return res.data;
};

export const createStudentBusAssignment = async (assignmentData) => {
    const res = await axios.post(API_URL, assignmentData);
    return res.data;
};
import axios from "axios";

export const getAllStudentRouteAssignments = async () => {
    const res = await axios.get("http://localhost:8080/api/studentrouteassignments");
    return res.data; // vì response là mảng [] nên trả về luôn
};

export const createStudentRouteAssignment = async (assignmentData) => {
    const res = await axios.post("http://localhost:8080/api/studentrouteassignments", assignmentData);
    return res.data;
}
export const deleteStudentRouteAssignment = async (assignmentId) => {
    const res = await axios.delete(`http://localhost:8080/api/studentrouteassignments/${assignmentId}`);
    return res.data;
}
export const getStudentRouteAssignmentById = async (id) => {
    const res = await axios.get(`http://localhost:8080/api/studentrouteassignments/${id}`);
    return res.data;
};

export const updateStudentRouteAssignment = async (assignmentId, assignmentData) => {
    const res = await axios.put(`http://localhost:8080/api/studentrouteassignments/${assignmentId}`, assignmentData);
    return res.data;
}
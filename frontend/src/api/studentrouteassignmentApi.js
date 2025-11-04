import axios from "axios";

export const getAllStudentRouteAssignments = async () => {
    const res = await axios.get("http://localhost:8080/api/studentrouteassignments");
    return res.data; // vì response là mảng [] nên trả về luôn
};

export const createStudentRouteAssignment = async (assignmentData) => {
    const res = await axios.post("http://localhost:8080/api/studentrouteassignments", assignmentData);
    return res.data;
}
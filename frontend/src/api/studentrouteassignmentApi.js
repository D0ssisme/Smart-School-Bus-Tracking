import axios from "axios";

export const getAllStudentRouteAssignments = async () => {
    const res = await axios.get("http://localhost:8080/api/studentrouteassignments");
    return res.data; // vì response là mảng [] nên trả về luôn
};

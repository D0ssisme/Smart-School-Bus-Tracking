import axios from "axios";

export const getAllStudents = async () => {
    const res = await axios.get("http://localhost:8080/api/student");
    return res.data; // vì response là mảng [] nên trả về luôn
};

export const createStudent = async (studentData) => {
    const res = await axios.post("http://localhost:8080/api/student", studentData);
    return res.data;
};

export const deleteStudent = async (studentId) => {
    const res = await axios.delete(`http://localhost:8080/api/student/${studentId}`);
    return res.data;
};

import axios from "axios";

export const getAllParentStudent = async () => {
    const res = await axios.get("http://localhost:8080/api/parentstudent");
    return res.data; // vì response là mảng [] nên trả về luôn
};
export const createParentStudent = async (data) => {
    const res = await axios.post("http://localhost:8080/api/parentstudent", data);
    return res.data;
};
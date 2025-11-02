import axios from "axios";

export const getAllStudents = async () => {
    const res = await axios.get("http://localhost:8080/api/student");
    return res.data; // vì response là mảng [] nên trả về luôn
};

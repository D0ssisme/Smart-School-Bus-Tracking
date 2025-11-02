import axios from "axios";

export const getAllBuschedule = async () => {
    const res = await axios.get("http://localhost:8080/api/busschedule");
    return res.data; // vì response là mảng [] nên trả về luôn
};

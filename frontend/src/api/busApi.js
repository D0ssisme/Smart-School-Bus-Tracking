import axios from "axios";

export const getAllBuses = async () => {
    const res = await axios.get("http://localhost:8080/api/bus");
    return res.data; // vì response là mảng [] nên trả về luôn
};

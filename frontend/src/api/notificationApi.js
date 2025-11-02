import axios from "axios";

export const getAllNotifications = async () => {
    const res = await axios.get("http://localhost:8080/api/notifications");
    return res.data; // vì response là mảng [] nên trả về luôn
};

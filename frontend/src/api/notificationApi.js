
//src/api/notificationApi.js
import axios from "axios";

export const getAllNotifications = async () => {
    const res = await axios.get("http://localhost:8080/api/notifications");
    return res.data; // vì response là mảng [] nên trả về luôn
};
export const getNotificationById = async (notificationId) => {
    const res = await axios.get(`http://localhost:8080/api/notifications/${notificationId}`);
    return res.data;
};
export const getNotificationsByReceiver = async (receiverId) => {
    const res = await axios.get(`http://localhost:8080/api/notifications/receiver/${receiverId}`);
    return res.data; // danh sách thông báo cho người nhận cụ thể
};
export const createNotification = async (notificationData) => {
    const res = await axios.post("http://localhost:8080/api/notifications", notificationData);
    return res.data;
}
export const markAllAsRead = async (receiverId) => {
    const res = await axios.patch(`http://localhost:8080/api/notifications/receiver/${receiverId}/mark-all-read`);
    return res.data;
}
export const markAsRead = async (notificationId) => {
    const res = await axios.patch(`http://localhost:8080/api/notifications/${notificationId}/mark-read`);
    return res.data;
}
export const deleteNotification = async (notificationId) => {
    const res = await axios.delete(`http://localhost:8080/api/notifications/${notificationId}`);
    return res.data;
}
    
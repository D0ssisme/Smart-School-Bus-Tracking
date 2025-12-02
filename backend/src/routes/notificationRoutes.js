import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationsByReceiver,
  getNotificationById,
  markAllAsRead,
  markAsRead,
  updateNotification,
  deleteNotification
} from "../controllers/NotificationControllers.js";

const router = express.Router();

// Tạo notification mới
router.post("/", createNotification);

// Lấy tất cả notifications
router.get("/", getAllNotifications);

// Lấy notifications theo receiver_id
router.get("/receiver/:receiver_id", getNotificationsByReceiver);

// Đánh dấu tất cả đã đọc cho một user
router.patch("/receiver/:receiver_id/mark-all-read", markAllAsRead);

// Lấy notification theo ID
router.get("/:id", getNotificationById);

// Cập nhật notification
router.put("/:id", updateNotification);

// Đánh dấu đã đọc một notification
router.patch("/:id/mark-read", markAsRead);

// Xóa notification
router.delete("/:id", deleteNotification);

export default router;

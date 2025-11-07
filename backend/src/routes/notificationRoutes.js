import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationsByReceiver
} from "../controllers/NotificationControllers.js";

const router = express.Router();

router.get("/receiver/:receiver_id", getNotificationsByReceiver);
router.post("/", createNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;

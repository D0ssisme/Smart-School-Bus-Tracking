import express from "express";
import { createUser, deleteUser, getAllUser, updateUser } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🧩 Lấy toàn bộ user (chỉ cho phép người có token)
router.get("/", verifyToken, getAllUser);

// 🧩 Tạo user mới (ví dụ: admin tạo tài khoản cho tài xế/phụ huynh)
router.post("/", verifyToken, createUser);

// 🧩 Cập nhật thông tin user theo id
router.put("/:id", verifyToken, updateUser);

// 🧩 Xóa user theo id
router.delete("/:id", verifyToken, deleteUser);

export default router;

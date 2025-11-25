import express from "express";
import { createUser, deleteUser, getAllUser, updateUser,getDrivers,getParents,getUserById } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🧩 Lấy toàn bộ user (chỉ cho phép người có token)
router.get("/", getAllUser);

// 🧩 Tạo user mới (ví dụ: admin tạo tài khoản cho tài xế/phụ huynh)
router.post("/", createUser);

// 🧩 Cập nhật thông tin user theo id
router.put("/:id", updateUser);

// 🧩 Xóa user theo id
router.delete("/:id", deleteUser);
router.get("/users/:id", getUserById);
router.get("/driver", getDrivers);
router.get("/parent", getParents);

export default router;

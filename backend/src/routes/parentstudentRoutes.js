import express from "express";
import {
  getAllParentStudent,
  createParentStudent,
  getStudentsByParent,
  updateParentStudent,
  deleteParentStudent
} from "../controllers/parentstudentControllers.js";

const router = express.Router();

// 🟢 Lấy tất cả quan hệ phụ huynh - học sinh
router.get("/", getAllParentStudent);

// 🟢 Tạo mới quan hệ
router.post("/", createParentStudent);

// 🟢 Lấy danh sách học sinh của 1 phụ huynh
router.get("/parent/:parent_id", getStudentsByParent);

// 🟡 Cập nhật quan hệ (ví dụ thay đổi relationshipType)
router.put("/:id", updateParentStudent);

// 🔴 Xóa quan hệ
router.delete("/:id", deleteParentStudent);

export default router;

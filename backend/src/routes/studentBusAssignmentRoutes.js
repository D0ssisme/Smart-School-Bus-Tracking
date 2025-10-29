import express from "express";
import {
  createStudentBusAssignment,
  getAllStudentBusAssignments,
  getStudentBusAssignmentById,
  updateStudentBusAssignment,

} from "../controllers/StudentBusAssignmentController.js";

const router = express.Router();

// 🟢 Tạo mới
router.post("/", createStudentBusAssignment);

// 🟡 Lấy tất cả
router.get("/", getAllStudentBusAssignments);

// 🔵 Lấy theo ID
router.get("/:id", getStudentBusAssignmentById);

// 🟠 Cập nhật
router.put("/:id", updateStudentBusAssignment);



export default router;

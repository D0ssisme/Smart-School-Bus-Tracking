import express from "express";
import {
  createStudentBusAssignment,
  getAllStudentBusAssignments,
  getStudentBusAssignmentById,
  updateStudentBusAssignment,
  deleteStudentBusAssignment,
  getStudentBusAssignmentByStudentId,
  getCountStudentByScheduleId,
  getStudentsByScheduleId



} from "../controllers/StudentBusAssignmentController.js";

const router = express.Router();


router.get('/schedule/:schedule_id', getStudentsByScheduleId);

router.get('/student/:student_id', getStudentBusAssignmentByStudentId);

router.get('/schedule/:schedule_id/count', getCountStudentByScheduleId);
// 🟢 Tạo mới
router.post("/", createStudentBusAssignment);

// 🟡 Lấy tất cả
router.get("/", getAllStudentBusAssignments);

// 🔵 Lấy theo ID
router.get("/:id", getStudentBusAssignmentById);

// 🟠 Cập nhật
router.put("/:id", updateStudentBusAssignment);

router.delete("/:id", deleteStudentBusAssignment);




export default router;

import express from "express";
import {
  createStudentRouteAssignment,
  getAllStudentRouteAssignments,
  getStudentRouteAssignmentById,
  updateStudentRouteAssignment,
  deleteStudentRouteAssignment,
} from "../controllers/StudentRouteAssignmentController..js";

const router = express.Router();

router.post("/", createStudentRouteAssignment);
router.get("/", getAllStudentRouteAssignments);
router.get("/:id", getStudentRouteAssignmentById);
router.put("/:id", updateStudentRouteAssignment);
router.delete("/:id", deleteStudentRouteAssignment);

export default router;

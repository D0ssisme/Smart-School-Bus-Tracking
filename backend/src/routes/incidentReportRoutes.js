import express from "express";
import {
  createIncidentReport,
  getAllIncidentReports,
  getIncidentReportById,
  updateIncidentReport,
  deleteIncidentReport,
  getReportsNearby,
  getIncidentReportByDriverId
} from "../controllers/IncidentReportsControllers.js";

const router = express.Router();
router.get("/driver/:driver_id", getIncidentReportByDriverId);
router.post("/", createIncidentReport);
router.get("/", getAllIncidentReports);
router.get("/nearby", getReportsNearby); // ?lng=106.66&lat=10.76&radius=1000
router.get("/:id", getIncidentReportById);
router.put("/:id", updateIncidentReport);
router.delete("/:id", deleteIncidentReport);

export default router;

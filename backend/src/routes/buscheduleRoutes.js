import express from "express";
import {
  createBusSchedule,
  getAllBusSchedules,
  getBusScheduleById,
  updateBusSchedule,
  deleteBusSchedule
} from "../controllers/BusScheduleControllers.js";

const router = express.Router();

router.post("/", createBusSchedule);
router.get("/", getAllBusSchedules);
router.get("/:id", getBusScheduleById);
router.put("/:id", updateBusSchedule);
router.delete("/:id", deleteBusSchedule);

export default router;

import express from "express";
import {
  createBusSchedule,
  getAllBusSchedules,
  getBusScheduleById,
  updateBusSchedule,
  deleteBusSchedule,getBusScheduleByDriverId
} from "../controllers/BusScheduleControllers.js";

const router = express.Router();

router.post("/", createBusSchedule);
router.get("/", getAllBusSchedules);
router.get("/:id", getBusScheduleById);
router.put("/:id", updateBusSchedule);
router.delete("/:id", deleteBusSchedule);
router.get('/driver/:driver_id', getBusScheduleByDriverId);

export default router;

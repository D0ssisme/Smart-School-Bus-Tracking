import express from "express";
import {
  getAllStops,
  createStop,
  getStopById,
  updateStop,
  deleteStop,
  getStopsNear,
} from "../controllers/stopControllers.js";

const router = express.Router();

router.get("/", getAllStops);
router.post("/", createStop);
router.get("/:id", getStopById);
router.put("/:id", updateStop);
router.delete("/:id", deleteStop);
router.get("/near/location", getStopsNear); // ?lng=&lat=&radius=

export default router;

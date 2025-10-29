import express from "express";
import {
  createRouteStop,
  getAllRouteStops,
  getStopsByRoute,
  updateRouteStop,
  deleteRouteStop
} from "../controllers/RoutestopControllers.js";

const router = express.Router();

router.post("/", createRouteStop);
router.get("/", getAllRouteStops);
router.get("/route/:routeId", getStopsByRoute);
router.put("/:id", updateRouteStop);
router.delete("/:id", deleteRouteStop);

export default router;

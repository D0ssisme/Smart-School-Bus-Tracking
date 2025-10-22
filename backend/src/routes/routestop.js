import express from 'express';
const router = express.Router();
import { getAllRouteStops, getStopsByRoute, createRouteStop } from '../controllers/RoutestopControllers.js';



router.get("/", getAllRouteStops)
router.post("/",createRouteStop)

router.get("/:id", getStopsByRoute); 


export default router;
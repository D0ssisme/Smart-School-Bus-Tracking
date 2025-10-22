import express from 'express';
const router = express.Router();
import { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../controllers/RouteControllers.js';



router.get("/", getAllRoutes)

router.post("/", createRoute)

router.delete("/:id", deleteRoute)

router.get("/:id", getRouteById); 


export default router;
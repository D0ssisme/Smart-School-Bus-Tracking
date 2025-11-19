import express from "express";
import {
    createRouteAuto,
    getRouteWithStops,
    getAllRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute,
} from "../controllers/RouteControllers.js";

const router = express.Router();
// ✅ Endpoint mới: tự động tạo tuyến đường theo danh sách stop
router.post("/auto", createRouteAuto);
router.get('/:routeId/with-stops', getRouteWithStops);
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;

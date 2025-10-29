import express from 'express';
const router = express.Router();
import { getAllBuses, createBus, updateBus, deleteBus } from '../controllers/BusControllers.js';



router.get("/", getAllBuses);

router.post("/", createBus);

router.put("/:id", updateBus);

router.delete("/:id", deleteBus)



export default router;
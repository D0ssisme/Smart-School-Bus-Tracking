// routes/busLocationRoutes.js
import express from 'express';
import {
    updateBusLocation,
    getCurrentBusLocation,
    getBusLocationHistory
} from '../controllers/busLocationController.js';

const router = express.Router();

router.post('/update', updateBusLocation);
router.get('/:bus_id', getCurrentBusLocation);
router.get('/:bus_id/history', getBusLocationHistory);

export default router;
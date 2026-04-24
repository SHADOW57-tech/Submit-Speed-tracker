import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createShipment, deleteShipment, getAllShipments, getAnalytics, getShipmentByTracking } from "../controllers/shipmentController.js";
const router = express.Router();

router.post('/', protect, createShipment);
router.get('/stats/analytics', protect, getAnalytics);
router.get('/', protect, getAllShipments);
router.get('/:id', getShipmentByTracking);
router.delete('/:id', protect, deleteShipment);

export default router;
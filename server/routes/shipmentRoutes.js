import express from "express"
import { createShipment, deleteShipment, getAllShipments, getAnalytics, getShipmentByTracking } from "../controllers/shipmentController.js";
const router = express.Router();


router.post('/', createShipment);
router.get('/:id', getShipmentByTracking);
router.get('/', getAllShipments);
router.delete('/:id', deleteShipment);
router.get('/stats/analytics', getAnalytics)

export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  createShipment, 
  deleteShipment, 
  getAllShipments, 
  getAnalytics, 
  getShipmentByTracking, 
  subscribeToShipment, 
  deleteUpdate,
  getAllSubscriptions,
  dispatchTrackingInfo,
  deleteSubscription,
} from "../controllers/shipmentController.js";

const router = express.Router();

// 1. Create a shipment
router.post('/', protect, createShipment);

// 2. Get Analytics
router.get('/stats/analytics', protect, getAnalytics);

// 3. Get all shipments
router.get('/', protect, getAllShipments);

// 4. Get a single shipment by tracking number (ID)
router.get('/:id', getShipmentByTracking);

// 5. Get all subscriptions for admin
router.get('/admin/subscriptions', protect, getAllSubscriptions);

// 6. Dispatch tracking info by email or WhatsApp
router.post('/dispatch', protect, dispatchTrackingInfo);

// 7. Delete a shipment
router.delete('/:id', protect, deleteShipment);

// 8. Subscribe to shipment
router.post('/:id/subscribe', subscribeToShipment);

// 9. Delete a specific update from a shipment
router.delete('/:shipmentId/updates/:updateId', protect, deleteUpdate);

// 10. Delete a subscription
router.delete('/subscription', protect, deleteSubscription);

export default router;
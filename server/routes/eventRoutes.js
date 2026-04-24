import express from "express";
import { addEvent } from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only Admins (protected) can add tracking events
router.post('/:shipmentId', protect, addEvent);

export default router;
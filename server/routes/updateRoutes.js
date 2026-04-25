import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addUpdate, getUpdates, deleteUpdate } from '../controllers/updateController.js';

const router = express.Router();

// Public route to get updates for a shipment
router.get('/:id/updates', getUpdates);

// Protected routes for admin
router.post('/:id/updates', protect, addUpdate);
router.delete('/updates/:updateId', protect, deleteUpdate);

export default router;
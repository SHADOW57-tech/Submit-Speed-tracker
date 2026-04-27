import express from 'express';
import { protect, ownerOnly } from '../middleware/authMiddleware.js';
import {
  getAdmins,
  toggleAdminStatus,
  getSystemLogs,
} from '../controllers/adminManagementController.js';

const router = express.Router();

router.get('/admins', protect, ownerOnly, getAdmins);
router.post('/admins/:userId/toggle', protect, ownerOnly, toggleAdminStatus);
router.get('/logs', protect, ownerOnly, getSystemLogs);

export default router;

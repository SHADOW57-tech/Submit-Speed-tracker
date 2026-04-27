import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/authController.js";

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, getAllUsers);

export default router;
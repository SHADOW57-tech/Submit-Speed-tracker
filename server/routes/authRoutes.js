import express from 'express';
const router = express.Router();
import { loginUser, registerUser, getAllUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/admin/users', protect, adminOnly, getAllUsers);

export default router;
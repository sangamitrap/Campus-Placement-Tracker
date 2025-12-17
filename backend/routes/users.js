import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, authorize('user'), getProfile);
router.put('/profile', authenticate, authorize('user'), updateProfile);

export default router;
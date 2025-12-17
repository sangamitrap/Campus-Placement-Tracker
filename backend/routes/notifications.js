import express from 'express';
import { getNotifications, markAsRead, createQuickNotifications } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.post('/create-quick', authenticate, createQuickNotifications);

export default router;
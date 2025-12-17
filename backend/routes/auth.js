import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate, validateSeceEmail } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateSeceEmail, register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
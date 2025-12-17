import express from 'express';
import { getAllJobs, createJob, getJobById } from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllJobs);
router.post('/', authenticate, authorize('interviewer'), createJob);
router.get('/:id', authenticate, getJobById);

export default router;
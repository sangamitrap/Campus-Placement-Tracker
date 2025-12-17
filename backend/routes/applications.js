import express from 'express';
import { applyToJob, getMyApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply/:jobId', authenticate, authorize('user'), applyToJob);
router.get('/my-applications', authenticate, authorize('user'), getMyApplications);
router.put('/update-status/:studentId/:jobId', authenticate, authorize('interviewer'), updateApplicationStatus);

export default router;
import express from 'express';
import { getInterviewerJobs, getStudentsForJob, getStudentDetails, getApplicationDetails, updateApplicationStatus } from '../controllers/interviewerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs', authenticate, authorize('interviewer'), getInterviewerJobs);
router.get('/students', authenticate, authorize('interviewer'), getStudentsForJob);
router.get('/student/:studentId', authenticate, authorize('interviewer'), getStudentDetails);
router.get('/application/:studentId/:jobId', authenticate, authorize('interviewer'), getApplicationDetails);
router.put('/update-status/:studentId/:jobId', authenticate, authorize('interviewer'), updateApplicationStatus);

export default router;
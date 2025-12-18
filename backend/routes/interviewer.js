import express from 'express';
import { getInterviewerJobs, getStudentsForJob, getStudentDetails, getApplicationDetails, updateApplicationStatus, getAllApplications, quickUpdateStatus } from '../controllers/interviewerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs', authenticate, authorize('interviewer'), getInterviewerJobs);
router.get('/students', authenticate, authorize('interviewer'), getStudentsForJob);
router.get('/applications', authenticate, authorize('interviewer'), getAllApplications);
router.get('/student/:studentId', authenticate, authorize('interviewer'), getStudentDetails);
router.get('/application/:studentId/:jobId', authenticate, authorize('interviewer'), getApplicationDetails);
router.put('/update-status/:studentId/:jobId', authenticate, authorize('interviewer'), updateApplicationStatus);
router.put('/quick-update/:applicationId', authenticate, authorize('interviewer'), quickUpdateStatus);

export default router;
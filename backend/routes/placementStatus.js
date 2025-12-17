import express from 'express';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/search', authenticate, async (req, res) => {
  try {
    const { registerNumber, department, section, company } = req.body;

    const user = await User.findOne({ 
      registerNumber, 
      department, 
      section 
    });

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const application = await Application.findOne({ 
      student: user._id 
    }).populate({
      path: 'job',
      match: { company: new RegExp(company, 'i') }
    });

    if (!application || !application.job) {
      return res.status(404).json({ message: 'No application found for this company' });
    }

    const placementData = {
      studentName: user.name,
      registerNumber: user.registerNumber,
      department: user.department,
      section: user.section,
      company: application.job.company,
      jobRole: application.job.title,
      status: application.status,
      interviewDate: application.appliedAt,
      interviewScore: application.interviewScore,
      feedback: application.feedback,
      feedbackBy: application.updatedBy ? 'Interviewer' : null
    };

    res.json(placementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
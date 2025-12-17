import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const checkEligibility = (user, job) => {
  return user.cgpa >= job.minCGPA && 
         user.backlogs <= job.maxBacklogs && 
         job.eligibleDepartments.includes(user.department);
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(userId);
    if (!checkEligibility(user, job)) {
      return res.status(400).json({ message: 'You are not eligible for this job' });
    }

    const existingApplication = await Application.findOne({ student: userId, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({ student: userId, job: jobId });
    await Job.findByIdAndUpdate(jobId, { $push: { applicants: userId } });

    // Create notification for successful application
    await Notification.create({
      recipient: userId,
      message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      type: 'application_submitted',
      relatedJob: jobId
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title company type location package')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { studentId, jobId } = req.params;
    const { status, interviewScore, feedback, notes } = req.body;

    const application = await Application.findOneAndUpdate(
      { student: studentId, job: jobId },
      { 
        status, 
        interviewScore, 
        feedback, 
        notes, 
        updatedBy: req.user._id, 
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Create notification for status update
    const job = await Job.findById(jobId);
    const statusMessages = {
      selected: `Congratulations! You have been selected for ${job.title} at ${job.company}.`,
      rejected: `Your application for ${job.title} at ${job.company} was not successful this time.`,
      shortlisted: `Good news! You have been shortlisted for ${job.title} at ${job.company}.`,
      interview_scheduled: `Interview scheduled for ${job.title} at ${job.company}. Check your email for details.`
    };

    if (statusMessages[status]) {
      await Notification.create({
        recipient: studentId,
        message: statusMessages[status],
        type: 'status_update',
        relatedJob: jobId
      });
    }

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
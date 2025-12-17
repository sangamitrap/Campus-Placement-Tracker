import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).populate('postedBy', 'name companyName');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, postedBy: req.user._id };
    const job = await Job.create(jobData);

    // Notify eligible students about new job
    const eligibleStudents = await User.find({
      role: 'student',
      department: { $in: job.eligibleDepartments },
      cgpa: { $gte: job.minCGPA },
      backlogs: { $lte: job.maxBacklogs }
    });

    const notifications = eligibleStudents.map(student => ({
      recipient: student._id,
      message: `New job opportunity: ${job.title} at ${job.company}. Check it out!`,
      type: 'new_job',
      relatedJob: job._id
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name companyName');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
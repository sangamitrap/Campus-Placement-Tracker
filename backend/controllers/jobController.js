import Job from '../models/Job.js';

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
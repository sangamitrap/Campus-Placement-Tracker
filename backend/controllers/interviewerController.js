import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

export const getInterviewerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentsForJob = async (req, res) => {
  try {
    const { jobId, department, minCGPA, skills } = req.query;
    
    let query = {};
    if (jobId) {
      const applications = await Application.find({ job: jobId }).select('student');
      const studentIds = applications.map(app => app.student);
      query._id = { $in: studentIds };
    }
    
    if (department) query.department = department;
    if (minCGPA) query.cgpa = { $gte: parseFloat(minCGPA) };
    if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };

    const students = await User.find({ ...query, role: 'user' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDetails = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationDetails = async (req, res) => {
  try {
    const { studentId, jobId } = req.params;
    const application = await Application.findOne({ student: studentId, job: jobId })
      .populate('job', 'title company')
      .populate('student', 'firstName lastName email');
    
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
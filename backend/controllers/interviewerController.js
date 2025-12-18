import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

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
      const applications = await Application.find({ job: jobId }).select('student status interviewScore');
      const studentIds = applications.map(app => app.student);
      query._id = { $in: studentIds };
      
      // Get students with application data
      const students = await User.find({ ...query, role: 'user' }).select('-password');
      
      // Add application status to each student
      const studentsWithStatus = students.map(student => {
        const application = applications.find(app => app.student.toString() === student._id.toString());
        return {
          ...student.toObject(),
          applicationStatus: application?.status,
          interviewScore: application?.interviewScore
        };
      });
      
      // Apply additional filters
      let filteredStudents = studentsWithStatus;
      if (department) filteredStudents = filteredStudents.filter(s => s.department === department);
      if (minCGPA) filteredStudents = filteredStudents.filter(s => s.cgpa >= parseFloat(minCGPA));
      if (skills) {
        const skillArray = skills.split(',').map(s => s.trim());
        filteredStudents = filteredStudents.filter(s => 
          s.skills && s.skills.some(skill => skillArray.includes(skill))
        );
      }
      
      res.json(filteredStudents);
    } else {
      if (department) query.department = department;
      if (minCGPA) query.cgpa = { $gte: parseFloat(minCGPA) };
      if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };

      const students = await User.find({ ...query, role: 'user' }).select('-password');
      res.json(students);
    }
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
    ).populate('job', 'title company');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Create notification for status update
    const job = await Job.findById(jobId);
    const statusMessages = {
      selected: `🎉 Congratulations! You have been selected for ${job.title} at ${job.company}.`,
      rejected: `📋 Your application for ${job.title} at ${job.company} was not successful this time. Keep applying!`,
      'on-hold': `⏳ Your application for ${job.title} at ${job.company} is currently on hold. We'll update you soon.`,
      pending: `📝 Your application for ${job.title} at ${job.company} is under review.`
    };

    if (statusMessages[status]) {
      await Notification.create({
        recipient: studentId,
        message: statusMessages[status],
        type: 'status_update',
        relatedJob: jobId
      });
    }

    res.json({ message: 'Application status updated successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    
    let query = {};
    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('student', 'firstName lastName email registerNumber department section cgpa backlogs skills')
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const quickUpdateStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { 
        status, 
        updatedBy: req.user._id, 
        lastUpdated: new Date() 
      },
      { new: true }
    ).populate('job', 'title company').populate('student', 'firstName lastName');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Create notification
    const statusMessages = {
      selected: `🎉 Congratulations! You have been selected for ${application.job.title} at ${application.job.company}.`,
      rejected: `📋 Your application for ${application.job.title} at ${application.job.company} was not successful this time.`,
      'on-hold': `⏳ Your application for ${application.job.title} at ${application.job.company} is currently on hold.`
    };

    if (statusMessages[status]) {
      await Notification.create({
        recipient: application.student._id,
        message: statusMessages[status],
        type: 'status_update',
        relatedJob: application.job._id
      });
    }

    res.json({ message: 'Status updated successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
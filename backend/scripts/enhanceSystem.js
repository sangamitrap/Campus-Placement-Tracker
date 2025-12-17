import mongoose from 'mongoose';

import dotenv from 'dotenv';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

dotenv.config();

const enhanceSystem = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Job titles and skills
    const jobTitles = [
      { title: '.NET Developer', skills: ['C#', 'ASP.NET', 'SQL Server', 'MVC', 'Entity Framework'] },
      { title: 'Java Developer', skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Maven'] },
      { title: 'Python Developer', skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API'] },
      { title: 'Frontend Developer', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'] },
      { title: 'Full Stack Developer', skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'] },
      { title: 'Data Analyst', skills: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'] },
      { title: 'Software Engineer', skills: ['Programming', 'Data Structures', 'Algorithms', 'Git', 'Testing'] },
      { title: 'Web Developer', skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'] },
      { title: 'Mobile Developer', skills: ['React Native', 'Flutter', 'Android', 'iOS', 'Firebase'] },
      { title: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'] }
    ];
    
    // Companies and their details
    const companies = [
      { name: 'TCS', package: '3.5-4.5 LPA', location: 'Chennai' },
      { name: 'Infosys', package: '4.0-5.0 LPA', location: 'Bangalore' },
      { name: 'Wipro', package: '3.8-4.8 LPA', location: 'Hyderabad' },
      { name: 'Accenture', package: '4.5-5.5 LPA', location: 'Mumbai' },
      { name: 'Cognizant', package: '4.0-5.0 LPA', location: 'Pune' },
      { name: 'HCL Technologies', package: '3.5-4.5 LPA', location: 'Noida' },
      { name: 'Tech Mahindra', package: '4.0-5.0 LPA', location: 'Chennai' },
      { name: 'Capgemini', package: '4.5-5.5 LPA', location: 'Bangalore' },
      { name: 'IBM', package: '5.0-6.0 LPA', location: 'Pune' },
      { name: 'Microsoft', package: '8.0-12.0 LPA', location: 'Hyderabad' }
    ];

    // Create jobs
    const jobsToCreate = [];
    for (let i = 0; i < 50; i++) {
      const jobTitle = jobTitles[i % jobTitles.length];
      const company = companies[i % companies.length];
      
      jobsToCreate.push({
        title: jobTitle.title,
        company: company.name,
        type: Math.random() > 0.3 ? 'fulltime' : 'internship',
        location: company.location,
        package: company.package,
        description: `Join our team as a ${jobTitle.title}. Work on exciting projects and grow your career.`,
        requiredSkills: jobTitle.skills,
        minCGPA: Math.random() > 0.5 ? 7.0 : 6.5,
        maxBacklogs: Math.random() > 0.7 ? 0 : 1,
        eligibleDepartments: ['CSE', 'ECE', 'EEE'],
        isActive: true,
        postedBy: null
      });
    }

    // Get or create interviewer
    let interviewer = await User.findOne({ role: 'interviewer' });
    if (!interviewer) {
      interviewer = await User.create({
        email: 'hr@tcs.com',
        password: 'password123',
        role: 'interviewer',
        name: 'HR Manager',
        companyName: 'TCS',
        employeeId: 'TCS001',
        interviewerRole: 'HR'
      });
    }

    // Set interviewer for all jobs
    jobsToCreate.forEach(job => job.postedBy = interviewer._id);

    // Clear existing jobs and create new ones
    await Job.deleteMany({});
    const createdJobs = await Job.insertMany(jobsToCreate);
    console.log(`Created ${createdJobs.length} jobs`);

    // Get students
    const students = await User.find({ role: 'user' });
    
    // Create applications for students
    const applications = [];
    const statuses = ['pending', 'selected', 'rejected', 'on-hold'];
    
    students.forEach(student => {
      // Each student applies to 3-8 random jobs
      const numApplications = Math.floor(Math.random() * 6) + 3;
      const selectedJobs = createdJobs.sort(() => 0.5 - Math.random()).slice(0, numApplications);
      
      selectedJobs.forEach(job => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        applications.push({
          student: student._id,
          job: job._id,
          status,
          appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          interviewScore: status === 'selected' ? Math.floor(Math.random() * 20) + 80 : 
                         status === 'rejected' ? Math.floor(Math.random() * 40) + 30 :
                         status === 'shortlisted' ? Math.floor(Math.random() * 30) + 60 : null,
          feedback: status === 'selected' ? 'Excellent performance in technical and HR rounds.' :
                   status === 'rejected' ? 'Good effort but needs improvement in technical skills.' :
                   status === 'on-hold' ? 'Application under review, will update soon.' : null
        });
      });
    });

    // Clear existing applications and create new ones
    await Application.deleteMany({});
    await Application.insertMany(applications);
    console.log(`Created ${applications.length} applications`);

    // Update job applicants
    for (const job of createdJobs) {
      const jobApplications = applications.filter(app => app.job.toString() === job._id.toString());
      job.applicants = jobApplications.map(app => app.student);
      await job.save();
    }

    // Create more diverse notifications
    const moreNotifications = [];
    students.forEach(student => {
      const studentApps = applications.filter(app => app.student.toString() === student._id.toString());
      
      studentApps.forEach(app => {
        const job = createdJobs.find(j => j._id.toString() === app.job.toString());
        if (job) {
          moreNotifications.push({
            recipient: student._id,
            message: `Application status updated for ${job.title} at ${job.company}: ${app.status.toUpperCase()}`,
            type: 'status_update',
            relatedJob: job._id
          });
        }
      });
    });

    await Notification.insertMany(moreNotifications);
    console.log(`Created ${moreNotifications.length} additional notifications`);

    console.log('System enhancement completed!');
  } catch (error) {
    console.error('Error enhancing system:', error);
  } finally {
    mongoose.connection.close();
  }
};

enhanceSystem();
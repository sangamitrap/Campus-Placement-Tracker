import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    // Create sample students
    const students = await User.create([
      {
        email: 'john.doe@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'John',
        lastName: 'Doe',
        registerNumber: '20CS001',
        department: 'CSE',
        section: 'A',
        cgpa: 8.5,
        backlogs: 0,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        areaOfInterest: ['Web Development', 'Full Stack Development'],
        internshipPreference: 'both'
      },
      {
        email: 'jane.smith@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Jane',
        lastName: 'Smith',
        registerNumber: '20CS002',
        department: 'CSE',
        section: 'A',
        cgpa: 9.2,
        backlogs: 0,
        skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
        areaOfInterest: ['AI/ML', 'Data Science'],
        internshipPreference: 'fulltime'
      },
      {
        email: 'mike.wilson@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Mike',
        lastName: 'Wilson',
        registerNumber: '20ECE001',
        department: 'ECE',
        section: 'B',
        cgpa: 7.8,
        backlogs: 1,
        skills: ['C++', 'Embedded Systems', 'IoT'],
        areaOfInterest: ['Embedded Systems', 'Hardware'],
        internshipPreference: 'internship'
      }
    ]);

    // Create sample interviewers
    const interviewers = await User.create([
      {
        email: 'hr@techcorp.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'Sarah Johnson',
        companyName: 'TechCorp Solutions',
        employeeId: 'TC001',
        interviewerRole: 'HR'
      },
      {
        email: 'tech@innovate.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'David Chen',
        companyName: 'Innovate Labs',
        employeeId: 'IL002',
        interviewerRole: 'Technical'
      }
    ]);

    // Create sample jobs
    const jobs = await Job.create([
      {
        title: 'Full Stack Developer',
        company: 'TechCorp Solutions',
        type: 'fulltime',
        location: 'Bangalore',
        package: '6-8 LPA',
        description: 'Looking for MERN stack developers',
        minCGPA: 7.5,
        maxBacklogs: 1,
        eligibleDepartments: ['CSE', 'ECE'],
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        postedBy: interviewers[0]._id,
        applicants: [students[0]._id, students[1]._id]
      },
      {
        title: 'Data Scientist Intern',
        company: 'Innovate Labs',
        type: 'internship',
        location: 'Hyderabad',
        package: '25k/month',
        description: 'ML and AI internship opportunity',
        minCGPA: 8.0,
        maxBacklogs: 0,
        eligibleDepartments: ['CSE'],
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow'],
        postedBy: interviewers[1]._id,
        applicants: [students[1]._id]
      },
      {
        title: 'Software Engineer',
        company: 'TechCorp Solutions',
        type: 'fulltime',
        location: 'Chennai',
        package: '5-7 LPA',
        description: 'Entry level software development role',
        minCGPA: 7.0,
        maxBacklogs: 2,
        eligibleDepartments: ['CSE', 'ECE', 'EEE'],
        requiredSkills: ['C++', 'Java', 'Problem Solving'],
        postedBy: interviewers[0]._id,
        applicants: [students[0]._id, students[2]._id]
      }
    ]);

    // Create sample applications
    const applications = await Application.create([
      {
        student: students[0]._id,
        job: jobs[0]._id,
        status: 'selected',
        interviewScore: 85,
        feedback: 'Excellent technical skills and good communication. Strong candidate for full-time role.',
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        student: students[1]._id,
        job: jobs[0]._id,
        status: 'pending',
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        student: students[1]._id,
        job: jobs[1]._id,
        status: 'selected',
        interviewScore: 92,
        feedback: 'Outstanding knowledge in ML and data science. Perfect fit for our team.',
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        student: students[0]._id,
        job: jobs[2]._id,
        status: 'rejected',
        interviewScore: 65,
        feedback: 'Good technical foundation but needs improvement in system design concepts.',
        appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        student: students[2]._id,
        job: jobs[2]._id,
        status: 'on-hold',
        interviewScore: 75,
        feedback: 'Decent performance. Waiting for more candidates before final decision.',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]);

    // Create sample notifications with deadlines and updates
    await Notification.create([
      {
        recipient: students[0]._id,
        message: 'Congratulations! You have been selected for Full Stack Developer at TechCorp Solutions',
        type: 'status_update',
        relatedJob: jobs[0]._id
      },
      {
        recipient: students[1]._id,
        message: 'Application deadline approaching: Data Scientist Intern closes in 3 days (Dec 25, 2024)',
        type: 'job_posted',
        relatedJob: jobs[1]._id
      },
      {
        recipient: students[0]._id,
        message: 'Your application status has been updated for Software Engineer position',
        type: 'status_update',
        relatedJob: jobs[2]._id
      },
      {
        recipient: students[2]._id,
        message: 'Interview scheduled for Dec 22, 2024 at 2:00 PM - Software Engineer at TechCorp Solutions',
        type: 'interview_scheduled',
        relatedJob: jobs[2]._id
      },
      {
        recipient: students[1]._id,
        message: 'Congratulations! You have been selected for Data Scientist Intern at Innovate Labs',
        type: 'status_update',
        relatedJob: jobs[1]._id
      },
      {
        recipient: students[0]._id,
        message: 'Reminder: Submit documents for Full Stack Developer position by Dec 20, 2024',
        type: 'status_update',
        relatedJob: jobs[0]._id
      },
      {
        recipient: students[2]._id,
        message: 'New job posted: Frontend Developer at WebTech Corp - Apply before Dec 30, 2024',
        type: 'job_posted'
      },
      {
        recipient: students[1]._id,
        message: 'Application deadline extended: Data Scientist Intern now closes Jan 5, 2025',
        type: 'job_posted',
        relatedJob: jobs[1]._id
      }
    ]);

    console.log('✅ Sample data created successfully!');
    console.log('\n📊 Created:');
    console.log(`- ${students.length} Students with profiles`);
    console.log(`- ${interviewers.length} Interviewers from companies`);
    console.log(`- ${jobs.length} Job postings with requirements`);
    console.log(`- ${applications.length} Applications with status/feedback`);
    console.log('- 8 Notifications with deadlines & updates');
    console.log('\n🔐 Login Credentials:');
    console.log('\nStudents:');
    console.log('john.doe@sece.ac.in | password123');
    console.log('jane.smith@sece.ac.in | password123');
    console.log('mike.wilson@sece.ac.in | password123');
    console.log('\nInterviewers:');
    console.log('hr@techcorp.com | password123');
    console.log('tech@innovate.com | password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
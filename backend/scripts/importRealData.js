import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

dotenv.config();

const importRealData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    // Create sample students with realistic profiles
    const students = await User.create([
      {
        email: 'rajesh.kumar@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        registerNumber: '20CS101',
        department: 'CSE',
        section: 'A',
        cgpa: 8.7,
        backlogs: 0,
        skills: ['Java', 'Python', 'React', 'Node.js', 'MongoDB', 'Spring Boot'],
        areaOfInterest: ['Backend Development', 'Full Stack Development', 'Software Engineering'],
        internshipPreference: 'both'
      },
      {
        email: 'priya.sharma@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Priya',
        lastName: 'Sharma',
        registerNumber: '20CS102',
        department: 'CSE',
        section: 'A',
        cgpa: 9.1,
        backlogs: 0,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'SQL', 'Tableau'],
        areaOfInterest: ['AI/ML', 'Data Science', 'Analytics'],
        internshipPreference: 'fulltime'
      },
      {
        email: 'amit.patel@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Amit',
        lastName: 'Patel',
        registerNumber: '20ECE201',
        department: 'ECE',
        section: 'B',
        cgpa: 7.9,
        backlogs: 1,
        skills: ['C++', 'Embedded Systems', 'IoT', 'Arduino', 'MATLAB'],
        areaOfInterest: ['Embedded Systems', 'Hardware Design', 'IoT'],
        internshipPreference: 'internship'
      },
      {
        email: 'sneha.reddy@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Sneha',
        lastName: 'Reddy',
        registerNumber: '20CS103',
        department: 'CSE',
        section: 'B',
        cgpa: 8.4,
        backlogs: 0,
        skills: ['JavaScript', 'React', 'Angular', 'Node.js', 'CSS', 'HTML'],
        areaOfInterest: ['Frontend Development', 'UI/UX', 'Web Development'],
        internshipPreference: 'both'
      },
      {
        email: 'vikram.singh@sece.ac.in',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        firstName: 'Vikram',
        lastName: 'Singh',
        registerNumber: '20EEE301',
        department: 'EEE',
        section: 'A',
        cgpa: 8.0,
        backlogs: 0,
        skills: ['Python', 'MATLAB', 'Power Systems', 'Control Systems'],
        areaOfInterest: ['Power Electronics', 'Renewable Energy', 'Automation'],
        internshipPreference: 'fulltime'
      }
    ]);

    // Create interviewers from real companies
    const interviewers = await User.create([
      {
        email: 'hr@tcs.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'Anita Desai',
        companyName: 'Tata Consultancy Services',
        employeeId: 'TCS001',
        interviewerRole: 'HR'
      },
      {
        email: 'tech@infosys.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'Ravi Krishnan',
        companyName: 'Infosys Limited',
        employeeId: 'INFY002',
        interviewerRole: 'Technical'
      },
      {
        email: 'recruiter@wipro.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'Meera Nair',
        companyName: 'Wipro Technologies',
        employeeId: 'WIP003',
        interviewerRole: 'HR'
      },
      {
        email: 'hiring@accenture.com',
        password: await bcrypt.hash('password123', 12),
        role: 'interviewer',
        name: 'David Johnson',
        companyName: 'Accenture',
        employeeId: 'ACC004',
        interviewerRole: 'Manager'
      }
    ]);

    // Read and process job dataset
    const jobData = JSON.parse(fs.readFileSync('job_dataset.json', 'utf8'));
    
    // Create jobs from real dataset (first 15 jobs)
    const jobs = [];
    for (let i = 0; i < Math.min(15, jobData.length); i++) {
      const jobItem = jobData[i];
      
      // Map skills to required skills
      const requiredSkills = jobItem.Skills ? jobItem.Skills.slice(0, 5) : ['Programming', 'Problem Solving'];
      
      // Determine eligible departments based on job title
      let eligibleDepartments = ['CSE'];
      if (jobItem.Title.toLowerCase().includes('data') || jobItem.Title.toLowerCase().includes('ai')) {
        eligibleDepartments = ['CSE', 'ECE'];
      } else if (jobItem.Title.toLowerCase().includes('android') || jobItem.Title.toLowerCase().includes('mobile')) {
        eligibleDepartments = ['CSE', 'ECE'];
      } else if (jobItem.Title.toLowerCase().includes('backend') || jobItem.Title.toLowerCase().includes('full')) {
        eligibleDepartments = ['CSE', 'ECE', 'EEE'];
      }

      // Determine CGPA and backlogs based on experience level
      let minCGPA = 7.0;
      let maxBacklogs = 2;
      if (jobItem.ExperienceLevel === 'Experienced') {
        minCGPA = 7.5;
        maxBacklogs = 1;
      } else if (jobItem.ExperienceLevel === 'Fresher') {
        minCGPA = 6.5;
        maxBacklogs = 3;
      }

      const job = {
        title: jobItem.Title,
        company: `Company ${i + 1}`, // Generic company names
        type: Math.random() > 0.5 ? 'fulltime' : 'internship',
        location: ['Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune'][Math.floor(Math.random() * 5)],
        package: jobItem.ExperienceLevel === 'Experienced' ? '8-12 LPA' : '4-6 LPA',
        description: jobItem.Responsibilities ? jobItem.Responsibilities.slice(0, 3).join('. ') : 'Exciting opportunity to work with cutting-edge technology.',
        minCGPA: minCGPA,
        maxBacklogs: maxBacklogs,
        eligibleDepartments: eligibleDepartments,
        requiredSkills: requiredSkills,
        postedBy: interviewers[Math.floor(Math.random() * interviewers.length)]._id,
        applicants: []
      };

      jobs.push(job);
    }

    const createdJobs = await Job.create(jobs);

    // Create applications with realistic data
    const applications = [];
    const statuses = ['pending', 'selected', 'rejected', 'on-hold'];
    
    // Each student applies to 2-4 jobs
    for (const student of students) {
      const numApplications = Math.floor(Math.random() * 3) + 2; // 2-4 applications
      const selectedJobs = createdJobs.sort(() => 0.5 - Math.random()).slice(0, numApplications);
      
      for (const job of selectedJobs) {
        // Check eligibility
        const isEligible = student.cgpa >= job.minCGPA && 
                          student.backlogs <= job.maxBacklogs && 
                          job.eligibleDepartments.includes(student.department);
        
        if (isEligible) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const application = {
            student: student._id,
            job: job._id,
            status: status,
            appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            interviewScore: status !== 'pending' ? Math.floor(Math.random() * 40) + 60 : null, // 60-100
            feedback: status !== 'pending' ? [
              'Good technical skills, needs improvement in communication',
              'Excellent problem-solving abilities and strong coding skills',
              'Great potential, recommended for next round',
              'Solid foundation but lacks practical experience',
              'Outstanding performance in technical interview'
            ][Math.floor(Math.random() * 5)] : null
          };
          
          applications.push(application);
          
          // Add student to job applicants
          await Job.findByIdAndUpdate(job._id, { $push: { applicants: student._id } });
        }
      }
    }

    await Application.create(applications);

    // Create realistic notifications
    const notifications = [];
    for (const student of students) {
      // Job posting notifications
      notifications.push({
        recipient: student._id,
        message: `New job posted: ${createdJobs[0].title} at ${createdJobs[0].company} - Apply before Dec 30, 2024`,
        type: 'job_posted',
        relatedJob: createdJobs[0]._id
      });

      // Application status notifications
      if (Math.random() > 0.5) {
        notifications.push({
          recipient: student._id,
          message: `Your application status has been updated for ${createdJobs[1].title} position`,
          type: 'status_update',
          relatedJob: createdJobs[1]._id
        });
      }

      // Interview scheduled notifications
      if (Math.random() > 0.7) {
        notifications.push({
          recipient: student._id,
          message: `Interview scheduled for Dec 28, 2024 at 10:00 AM - ${createdJobs[2].title} at ${createdJobs[2].company}`,
          type: 'interview_scheduled',
          relatedJob: createdJobs[2]._id
        });
      }

      // Deadline reminders
      notifications.push({
        recipient: student._id,
        message: `Application deadline approaching: ${createdJobs[3].title} closes in 5 days (Jan 2, 2025)`,
        type: 'job_posted',
        relatedJob: createdJobs[3]._id
      });
    }

    await Notification.create(notifications);

    console.log('✅ Real data imported successfully!');
    console.log('\n📊 Imported:');
    console.log(`- ${students.length} Students with realistic profiles`);
    console.log(`- ${interviewers.length} Interviewers from top companies`);
    console.log(`- ${createdJobs.length} Jobs from real dataset`);
    console.log(`- ${applications.length} Applications with status/feedback`);
    console.log(`- ${notifications.length} Notifications with deadlines & updates`);

    console.log('\n🔐 Login Credentials:');
    console.log('\nStudents:');
    console.log('rajesh.kumar@sece.ac.in | password123');
    console.log('priya.sharma@sece.ac.in | password123');
    console.log('amit.patel@sece.ac.in | password123');
    console.log('sneha.reddy@sece.ac.in | password123');
    console.log('vikram.singh@sece.ac.in | password123');
    console.log('\nInterviewers:');
    console.log('hr@tcs.com | password123');
    console.log('tech@infosys.com | password123');
    console.log('recruiter@wipro.com | password123');
    console.log('hiring@accenture.com | password123');

    process.exit(0);
  } catch (error) {
    console.error('Error importing real data:', error);
    process.exit(1);
  }
};

importRealData();
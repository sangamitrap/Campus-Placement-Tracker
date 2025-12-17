import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

dotenv.config();

const createUpcomingAlerts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all students
    const students = await User.find({ role: 'user' });
    
    if (students.length === 0) {
      console.log('No students found');
      return;
    }

    // Clear existing notifications
    await Notification.deleteMany({});

    const upcomingAlerts = [
      {
        message: "🎯 Campus Placement Drive 2024 starts next week! Update your profile and prepare your resume.",
        type: "placement_drive"
      },
      {
        message: "📋 TCS recruitment process begins tomorrow. Eligible students can apply until 5 PM.",
        type: "recruitment_alert"
      },
      {
        message: "💼 Infosys is conducting a pre-placement talk on Friday at 2 PM in the main auditorium.",
        type: "company_visit"
      },
      {
        message: "⚠️ Profile verification deadline is approaching. Complete your profile by this weekend.",
        type: "profile_reminder"
      },
      {
        message: "🏆 Wipro coding assessment scheduled for next Monday. Practice coding problems now!",
        type: "assessment_alert"
      },
      {
        message: "📚 Resume building workshop tomorrow at 10 AM. Attendance is mandatory for final year students.",
        type: "workshop_alert"
      },
      {
        message: "🎤 Mock interview sessions available this week. Book your slot through the placement portal.",
        type: "interview_prep"
      },
      {
        message: "📊 Accenture eligibility criteria updated. Check if you meet the new requirements.",
        type: "eligibility_update"
      },
      {
        message: "🔔 New job opportunities added! 15 companies are hiring for various roles.",
        type: "job_alert"
      },
      {
        message: "⏰ Last date to apply for Cognizant is this Friday. Don't miss the opportunity!",
        type: "deadline_reminder"
      }
    ];

    // Create notifications for all students
    const notifications = [];
    students.forEach(student => {
      upcomingAlerts.forEach(alert => {
        notifications.push({
          recipient: student._id,
          message: alert.message,
          type: alert.type,
          isRead: false
        });
      });
    });

    await Notification.insertMany(notifications);
    console.log(`Created ${notifications.length} upcoming alerts for ${students.length} students`);

  } catch (error) {
    console.error('Error creating alerts:', error);
  } finally {
    mongoose.connection.close();
  }
};

createUpcomingAlerts();
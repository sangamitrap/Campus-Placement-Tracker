import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createSystemNotifications = async () => {
  try {
    const students = await User.find({ role: 'user' });
    
    if (students.length === 0) return;

    // Check if system notifications already exist
    const existingNotifications = await Notification.countDocuments({ type: 'system_alert' });
    
    if (existingNotifications > 0) return; // Don't create duplicates

    const systemAlerts = [
      "🎉 Welcome to the Campus Placement Portal! Complete your profile to get personalized job recommendations.",
      "📝 Don't forget to update your skills and resume. Companies are actively reviewing profiles!",
      "🚀 New placement season has begun! Stay updated with latest job postings and company visits.",
      "💡 Tip: Maintain a CGPA above 7.0 and zero backlogs to be eligible for most companies.",
      "📞 Need help? Contact the placement cell during office hours for any assistance."
    ];

    const notifications = [];
    students.forEach(student => {
      systemAlerts.forEach(message => {
        notifications.push({
          recipient: student._id,
          message,
          type: 'system_alert',
          isRead: false
        });
      });
    });

    await Notification.insertMany(notifications);
    console.log(`Created ${notifications.length} system notifications`);
  } catch (error) {
    console.error('Error creating system notifications:', error);
  }
};
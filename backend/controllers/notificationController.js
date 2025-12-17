import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('relatedJob', 'title company')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuickNotifications = async (req, res) => {
  try {
    const quickAlerts = [
      "🎯 New placement opportunities available! Check the jobs section.",
      "📋 Interview schedules updated. Check your application status.",
      "💼 Company presentations happening this week. Don't miss out!",
      "⚠️ Profile verification in progress. Ensure all details are correct.",
      "🏆 Assessment results will be announced soon. Stay tuned!"
    ];

    const notifications = quickAlerts.map(message => ({
      recipient: req.user._id,
      message,
      type: 'system_alert'
    }));

    await Notification.insertMany(notifications);
    res.json({ message: 'Quick notifications created', count: notifications.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
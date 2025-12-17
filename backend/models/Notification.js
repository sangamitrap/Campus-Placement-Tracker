import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['job_posted', 'status_update', 'interview_scheduled'], required: true },
  isRead: { type: Boolean, default: false },
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
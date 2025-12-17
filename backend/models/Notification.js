import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['job_posted', 'status_update', 'interview_scheduled', 'application_submitted', 'new_job', 'placement_drive', 'recruitment_alert', 'company_visit', 'profile_reminder', 'assessment_alert', 'workshop_alert', 'interview_prep', 'eligibility_update', 'job_alert', 'deadline_reminder', 'system_alert'], required: true },
  isRead: { type: Boolean, default: false },
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
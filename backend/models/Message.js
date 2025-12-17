import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  isRead: { type: Boolean, default: false },
  messageType: { type: String, enum: ['text', 'interview_invite', 'status_update'], default: 'text' }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
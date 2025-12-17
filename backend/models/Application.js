import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['pending', 'selected', 'rejected', 'on-hold'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  interviewScore: Number,
  feedback: String,
  notes: String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: Date
}, { timestamps: true });

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ['internship', 'fulltime'], required: true },
  location: { type: String, required: true },
  package: String,
  description: String,
  minCGPA: { type: Number, required: true },
  maxBacklogs: { type: Number, default: 0 },
  eligibleDepartments: [{ type: String, enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'] }],
  requiredSkills: [String],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
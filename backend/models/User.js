import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'interviewer'], default: 'user' },
  
  // Student fields
  firstName: String,
  lastName: String,
  registerNumber: String,
  department: { type: String, enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'] },
  section: { type: String, enum: ['A', 'B', 'C'] },
  cgpa: Number,
  backlogs: { type: Number, default: 0 },
  linkedinUrl: String,
  areaOfInterest: [String],
  skills: [String],
  internshipPreference: { type: String, enum: ['internship', 'fulltime', 'both'], default: 'both' },
  
  // Interviewer fields
  name: String,
  companyName: String,
  employeeId: String,
  interviewerRole: { type: String, enum: ['HR', 'Technical', 'Manager'] }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
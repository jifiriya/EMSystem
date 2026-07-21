const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'HR Manager', 'Employee'], default: 'HR Manager' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

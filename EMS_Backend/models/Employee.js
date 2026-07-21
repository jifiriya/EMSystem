const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, uppercase: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  role: { type: String, required: true, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' }
  }
}, { timestamps: true });

// Virtual full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);

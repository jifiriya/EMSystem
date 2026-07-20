const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route  GET /api/employees
// @desc   Get all employees with filter, search, and pagination
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { q, department, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = req.query;

  const query = {};
  if (q) {
    const searchRegex = new RegExp(q.trim(), 'i');
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { employeeId: searchRegex },
      { role: searchRegex }
    ];
  }
  if (department && department !== 'all') query.department = department;
  if (status && status !== 'all') query.status = status;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 50);
  const skip = (pageNum - 1) * limitNum;

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .populate('department', 'name code location')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum),
    Employee.countDocuments(query)
  ]);

  res.json({
    employees,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1
  });
}));

// @route  GET /api/employees/:id
// @desc   Get single employee by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('department', 'name code location description managerName');
    
  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  res.json(employee);
}));

// @route  POST /api/employees
// @desc   Create a new employee (Admin Only)
router.post('/', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, role, department, status, joinDate, salary, avatar, bio, emergencyContact } = req.body;

  if (!firstName || !lastName || !email || !role || !department || salary === undefined) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingEmail = await Employee.findOne({ email: normalizedEmail });
  if (existingEmail) {
    return res.status(409).json({ success: false, message: 'An employee with this email already exists' });
  }

  const deptExists = await Department.findById(department);
  if (!deptExists) {
    return res.status(400).json({ success: false, message: 'Specified department does not exist' });
  }

  let empId = req.body.employeeId;
  if (!empId) {
    const count = await Employee.countDocuments();
    empId = `EMP-${String(count + 101).padStart(3, '0')}`;
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=4f46e5&color=fff&size=150`;

  const newEmployee = new Employee({
    employeeId: empId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    phone: phone || '',
    role: role.trim(),
    department,
    status: status || 'Active',
    joinDate: joinDate ? new Date(joinDate) : new Date(),
    salary: Number(salary),
    avatar: avatar || defaultAvatar,
    bio: bio || '',
    emergencyContact: emergencyContact || {}
  });

  const saved = await newEmployee.save();

  // Provision User login account for the newly created employee if not existing
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (!existingUser) {
    const initialPassword = req.body.initialPassword || 'password123';
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    await User.create({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'Employee',
      avatar: avatar || defaultAvatar
    });
    console.log(`👤 Automatically provisioned user account for ${normalizedEmail}`);
  }

  const populated = await Employee.findById(saved._id).populate('department', 'name code location');
  res.status(201).json(populated);
}));

// @route  PUT /api/employees/:id
// @desc   Update an existing employee (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  const { firstName, lastName, email, phone, role, department, status, joinDate, salary, avatar, bio, emergencyContact } = req.body;
  const oldEmail = employee.email;

  if (email && email.toLowerCase().trim() !== employee.email) {
    const existingEmail = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'An employee with this email already exists' });
    }
    employee.email = email.toLowerCase().trim();
  }

  if (department && department !== employee.department.toString()) {
    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({ success: false, message: 'Specified department does not exist' });
    }
    employee.department = department;
  }

  if (firstName) employee.firstName = firstName.trim();
  if (lastName) employee.lastName = lastName.trim();
  if (phone !== undefined) employee.phone = phone;
  if (role) employee.role = role.trim();
  if (status) employee.status = status;
  if (joinDate) employee.joinDate = new Date(joinDate);
  if (salary !== undefined) employee.salary = Number(salary);
  if (avatar !== undefined) employee.avatar = avatar;
  if (bio !== undefined) employee.bio = bio;
  if (emergencyContact !== undefined) employee.emergencyContact = emergencyContact;

  const updated = await employee.save();

  // Sync user email & name if modified
  if (oldEmail !== updated.email || firstName || lastName) {
    await User.updateOne(
      { email: oldEmail },
      { 
        email: updated.email,
        name: `${updated.firstName} ${updated.lastName}`
      }
    );
  }

  const populated = await Employee.findById(updated._id).populate('department', 'name code location');
  res.json(populated);
}));

// @route  DELETE /api/employees/:id
// @desc   Delete an employee (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  // Remove corresponding user account if present
  await User.deleteOne({ email: deleted.email });

  res.json({ success: true, message: 'Employee removed successfully' });
}));

module.exports = router;

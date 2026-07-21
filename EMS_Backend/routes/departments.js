const express = require('express');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route  GET /api/departments
// @desc   Get all departments with employee counts
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 }).lean();
  const departmentsWithCounts = await Promise.all(
    departments.map(async (dept) => {
      const count = await Employee.countDocuments({ department: dept._id });
      return { ...dept, employeeCount: count };
    })
  );
  res.json(departmentsWithCounts);
}));

// @route  GET /api/departments/:id
// @desc   Get single department by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  const count = await Employee.countDocuments({ department: department._id });
  res.json({ ...department.toObject(), employeeCount: count });
}));

// @route  POST /api/departments
// @desc   Create a new department (Admin Only)
router.post('/', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { name, code, description, managerName, location, budget } = req.body;

  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Department name and code are required' });
  }

  const existingCode = await Department.findOne({ code: code.toUpperCase() });
  if (existingCode) {
    return res.status(409).json({ success: false, message: 'Department code already exists' });
  }

  const existingName = await Department.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
  if (existingName) {
    return res.status(409).json({ success: false, message: 'Department name already exists' });
  }

  const newDept = new Department({
    name: name.trim(),
    code: code.toUpperCase().trim(),
    description: description || '',
    managerName: managerName || 'Unassigned',
    location: location || 'Headquarters',
    budget: Number(budget) || 0
  });

  const saved = await newDept.save();
  res.status(201).json(saved);
}));

// @route  PUT /api/departments/:id
// @desc   Update an existing department (Admin Only)
router.put('/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  const { name, code, description, managerName, location, budget } = req.body;

  if (code && code.toUpperCase() !== department.code) {
    const existingCode = await Department.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(409).json({ success: false, message: 'Department code already exists' });
    }
    department.code = code.toUpperCase().trim();
  }

  if (name && name.trim() !== department.name) {
    const existingName = await Department.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existingName) {
      return res.status(409).json({ success: false, message: 'Department name already exists' });
    }
    department.name = name.trim();
  }

  if (description !== undefined) department.description = description;
  if (managerName !== undefined) department.managerName = managerName;
  if (location !== undefined) department.location = location;
  if (budget !== undefined) department.budget = Number(budget);

  const updated = await department.save();
  res.json(updated);
}));

// @route  DELETE /api/departments/:id
// @desc   Delete a department (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const deptId = req.params.id;
  const department = await Department.findById(deptId);
  if (!department) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }

  const employeeCount = await Employee.countDocuments({ department: deptId });
  if (employeeCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete department because ${employeeCount} employee(s) are assigned to it.`
    });
  }

  await Department.findByIdAndDelete(deptId);
  res.json({ success: true, message: 'Department deleted successfully' });
}));

module.exports = router;

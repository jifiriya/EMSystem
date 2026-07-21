const express = require('express');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const { authMiddleware } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// @route  GET /api/dashboard/stats
// @desc   Get dashboard metrics and statistics
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const [
    totalEmployees,
    activeEmployees,
    onLeaveEmployees,
    inactiveEmployees,
    totalDepartments,
    payrollAgg,
    recentHires,
    departments
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'Active' }),
    Employee.countDocuments({ status: 'On Leave' }),
    Employee.countDocuments({ status: 'Inactive' }),
    Department.countDocuments(),
    Employee.aggregate([{ $group: { _id: null, totalSalary: { $sum: '$salary' } } }]),
    Employee.find().populate('department', 'name code').sort({ createdAt: -1 }).limit(5),
    Department.find().lean()
  ]);

  const totalSalary = payrollAgg.length > 0 ? payrollAgg[0].totalSalary : 0;

  const deptDistribution = await Promise.all(
    departments.map(async (dept) => {
      const count = await Employee.countDocuments({ department: dept._id });
      const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
      return {
        id: dept._id,
        name: dept.name,
        code: dept.code,
        employeeCount: count,
        percentage
      };
    })
  );

  res.json({
    metrics: {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      inactiveEmployees,
      totalDepartments,
      totalSalary
    },
    recentHires,
    departmentDistribution: deptDistribution
  });
}));

module.exports = router;

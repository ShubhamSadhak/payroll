const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const SalarySlip = require('../models/SalarySlip');
const User = require('../models/User');

// Get salary slips
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let salarySlips;
    if (user.role === 'admin') {
      salarySlips = await SalarySlip.find({}).sort({ createdAt: -1 });
    } else {
      salarySlips = await SalarySlip.find({ employeeId: user.employeeId }).sort({ createdAt: -1 });
    }

    res.json(salarySlips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create salary slip (Admin only)
router.post('/', [auth, adminAuth], [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('month').notEmpty().withMessage('Month is required'),
  body('basicSalary').isNumeric().withMessage('Basic salary must be a number'),
  body('allowances').optional().isNumeric().withMessage('Allowances must be a number'),
  body('deductions').optional().isNumeric().withMessage('Deductions must be a number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { employeeId, month, basicSalary, allowances = 0, deductions = 0 } = req.body;

  try {
    const employee = await User.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    const netSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions);

    const salarySlip = new SalarySlip({
      employeeId,
      employeeName: employee.name,
      month,
      basicSalary: parseFloat(basicSalary),
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      netSalary
    });

    await salarySlip.save();
    res.json(salarySlip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

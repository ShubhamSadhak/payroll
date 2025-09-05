const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SalarySlip = require('../models/SalarySlip');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let salarySlips, expenses, totalEmployees;

    if (user.role === 'admin') {
      salarySlips = await SalarySlip.find({});
      expenses = await Expense.find({});
      totalEmployees = await User.countDocuments({ role: 'employee' });
    } else {
      salarySlips = await SalarySlip.find({ employeeId: user.employeeId });
      expenses = await Expense.find({ employeeId: user.employeeId });
      totalEmployees = 1;
    }

    const totalSalary = salarySlips.reduce((sum, slip) => sum + slip.netSalary, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthSalary = salarySlips
      .filter(slip => slip.month === currentMonth)
      .reduce((sum, slip) => sum + slip.netSalary, 0);

    res.json({
      totalSalary,
      totalExpenses,
      totalEmployees,
      thisMonth: thisMonthSalary
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

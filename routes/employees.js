const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');

// Get all employees (Admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

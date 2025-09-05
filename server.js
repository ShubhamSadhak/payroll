require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const salarySlipsRoutes = require('./routes/salarySlips');
const expensesRoutes = require('./routes/expenses');
const employeesRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors('*'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/salary-slips', salarySlipsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/employees', employeesRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

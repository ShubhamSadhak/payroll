# PayrollPro Backend

Backend API for PayrollPro management system built with Node.js, Express, and MongoDB.

## Features

- User authentication (login/signup) with JWT
- Role-based access control (Employee/Admin)
- Salary slip management
- Expense tracking and approval system
- Dashboard statistics
- Employee management (Admin only)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/payroll
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

3. Start MongoDB locally or update MONGO_URI for cloud database.

4. Run the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Salary Slips
- `GET /api/salary-slips` - Get salary slips
- `POST /api/salary-slips` - Create salary slip (Admin only)

### Expenses
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id/approve` - Approve expense (Admin only)
- `PUT /api/expenses/:id/reject` - Reject expense (Admin only)
- `DELETE /api/expenses/:id` - Delete expense (Own expense only)

### Employees
- `GET /api/employees` - Get all employees (Admin only)

## Frontend Integration

The frontend (index.html) needs to be updated to make API calls to these endpoints instead of using localStorage. Replace the JavaScript functions with fetch calls to the backend.

Example:
```javascript
// Instead of localStorage, use API
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
```

## Sample Data

You can create sample users, salary slips, and expenses through the API or directly in MongoDB.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation with express-validator

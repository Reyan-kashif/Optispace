const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/roles');

// All analytics routes require Admin
router.use(authenticate, authorizeAdmin);

// GET /api/analytics/utilization
router.get('/utilization', analyticsController.getUtilization);

// GET /api/analytics/by-day
router.get('/by-day', analyticsController.getByDay);

// GET /api/analytics/by-type
router.get('/by-type', analyticsController.getByType);

// GET /api/analytics/active-users
router.get('/active-users', analyticsController.getActiveUsers);

// GET /api/analytics/monthly
router.get('/monthly', analyticsController.getMonthlyReport);

// GET /api/analytics/by-department
router.get('/by-department', analyticsController.getByDepartment);

module.exports = router;

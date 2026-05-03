const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;

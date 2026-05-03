const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/roles');

// All user routes require Admin
router.use(authenticate, authorizeAdmin);

// GET /api/users
router.get('/', userController.getAllUsers);

// POST /api/users
router.post('/', userController.createUser);

// PUT /api/users/:id
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', userController.deactivateUser);

// PUT /api/users/:id/activate
router.put('/:id/activate', userController.activateUser);

module.exports = router;

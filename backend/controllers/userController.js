const pool = require('../config/db');
const bcrypt = require('bcrypt');
const userQueries = require('../queries/userQueries');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(userQueries.getAllUsers);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Users retrieved successfully.',
    });
  } catch (err) {
    console.error('GetAllUsers error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { full_name, email, password, role_id, department_id, reg_number } = req.body;

    if (!full_name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Full name, email, password, and role are required.',
      });
    }

    const emailCheck = await pool.query(userQueries.checkEmailExists, [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'A user with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(userQueries.createUser, [
      full_name,
      email,
      passwordHash,
      role_id,
      department_id || null,
      reg_number || null,
      req.user.user_id,
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'User created successfully.',
    });
  } catch (err) {
    console.error('CreateUser error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role_id, department_id, reg_number } = req.body;

    if (!full_name || !email || !role_id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Full name, email, and role are required.',
      });
    }

    const result = await pool.query(userQueries.updateUser, [
      full_name,
      email,
      role_id,
      department_id || null,
      reg_number || null,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User updated successfully.',
    });
  } catch (err) {
    console.error('UpdateUser error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Cannot deactivate your own account.',
      });
    }

    const result = await pool.query(userQueries.deactivateUser, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User deactivated successfully.',
    });
  } catch (err) {
    console.error('DeactivateUser error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(userQueries.activateUser, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User activated successfully.',
    });
  } catch (err) {
    console.error('ActivateUser error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
};

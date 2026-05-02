const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authQueries = require('../queries/authQueries');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email and password are required.',
      });
    }

    const result = await pool.query(authQueries.getUserByEmail, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'Account is deactivated. Contact administrator.',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role_name,
        department_id: user.department_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role: user.role_name,
          department_id: user.department_id,
          reg_number: user.reg_number,
        },
      },
      message: 'Login successful.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(authQueries.getUserById, [req.user.user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        reg_number: user.reg_number,
        role: user.role_name,
        role_id: user.role_id,
        department_id: user.department_id,
        dept_name: user.dept_name,
        dept_code: user.dept_code,
        is_active: user.is_active,
        created_at: user.created_at,
      },
      message: 'User info retrieved successfully.',
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  login,
  getMe,
};

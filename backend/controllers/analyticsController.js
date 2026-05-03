const pool = require('../config/db');
const analyticsQueries = require('../queries/analyticsQueries');

const getUtilization = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.facilityUtilization);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Facility utilization data retrieved successfully.',
    });
  } catch (err) {
    console.error('GetUtilization error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getByDay = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.bookingsByDay);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Booking trends by day retrieved successfully.',
    });
  } catch (err) {
    console.error('GetByDay error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getByType = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.bookingsByType);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Booking trends by facility type retrieved successfully.',
    });
  } catch (err) {
    console.error('GetByType error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.activeUsers);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Most active users retrieved successfully.',
    });
  } catch (err) {
    console.error('GetActiveUsers error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.monthlyReport);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Monthly report retrieved successfully.',
    });
  } catch (err) {
    console.error('GetMonthlyReport error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getByDepartment = async (req, res) => {
  try {
    const result = await pool.query(analyticsQueries.byDepartment);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Department-wise analytics retrieved successfully.',
    });
  } catch (err) {
    console.error('GetByDepartment error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getUtilization,
  getByDay,
  getByType,
  getActiveUsers,
  getMonthlyReport,
  getByDepartment,
};

const pool = require('../config/db');
const recommendationQueries = require('../queries/recommendationQueries');

const getLeastUsed = async (req, res) => {
  try {
    const result = await pool.query(recommendationQueries.leastUsedFacilities);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Least used facilities retrieved successfully.',
    });
  } catch (err) {
    console.error('GetLeastUsed error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getBestSlots = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const result = await pool.query(recommendationQueries.bestSlots, [facilityId]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Best available time slots retrieved successfully.',
    });
  } catch (err) {
    console.error('GetBestSlots error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getSimilarFacilities = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const result = await pool.query(recommendationQueries.similarFacilities, [facilityId]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Similar facilities retrieved successfully.',
    });
  } catch (err) {
    console.error('GetSimilarFacilities error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getByDepartment = async (req, res) => {
  try {
    const departmentId = req.user.department_id;

    if (!departmentId) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'User does not belong to a department.',
      });
    }

    const result = await pool.query(recommendationQueries.byDepartment, [departmentId]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Department-based recommendations retrieved successfully.',
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

const getNextSlot = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const result = await pool.query(recommendationQueries.nextAvailableSlot, [facilityId]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Next available slots retrieved successfully.',
    });
  } catch (err) {
    console.error('GetNextSlot error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getLeastUsed,
  getBestSlots,
  getSimilarFacilities,
  getByDepartment,
  getNextSlot,
};

const pool = require('../config/db');
const facilityQueries = require('../queries/facilityQueries');

const getAllFacilities = async (req, res) => {
  try {
    const result = await pool.query(facilityQueries.getAllFacilities);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Facilities retrieved successfully.',
    });
  } catch (err) {
    console.error('GetAllFacilities error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facilityResult = await pool.query(facilityQueries.getFacilityById, [id]);

    if (facilityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Facility not found.',
      });
    }

    const equipmentResult = await pool.query(facilityQueries.getEquipmentByFacility, [id]);

    const facility = {
      ...facilityResult.rows[0],
      equipment: equipmentResult.rows,
    };

    return res.status(200).json({
      success: true,
      data: facility,
      message: 'Facility retrieved successfully.',
    });
  } catch (err) {
    console.error('GetFacilityById error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getAvailableFacilities = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Start and end times are required.',
      });
    }

    const result = await pool.query(facilityQueries.getAvailableFacilities, [start, end]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Available facilities retrieved successfully.',
    });
  } catch (err) {
    console.error('GetAvailableFacilities error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const createFacility = async (req, res) => {
  try {
    const { facility_name, facility_type, capacity, location, department_id } = req.body;

    if (!facility_name || !facility_type) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Facility name and type are required.',
      });
    }

    const result = await pool.query(facilityQueries.createFacility, [
      facility_name,
      facility_type,
      capacity != null ? capacity : null,
      location || null,
      department_id || null,
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Facility created successfully.',
    });
  } catch (err) {
    console.error('CreateFacility error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { facility_name, facility_type, capacity, location, department_id, is_available } = req.body;

    if (!facility_name || !facility_type) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Facility name and type are required.',
      });
    }

    const result = await pool.query(facilityQueries.updateFacility, [
      facility_name,
      facility_type,
      capacity || null,
      location || null,
      department_id || null,
      is_available !== undefined ? is_available : true,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Facility not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Facility updated successfully.',
    });
  } catch (err) {
    console.error('UpdateFacility error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingCheck = await pool.query(facilityQueries.checkFacilityHasBookings, [id]);
    if (parseInt(bookingCheck.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Cannot delete facility with active bookings. Cancel or wait for bookings to end first.',
      });
    }

    const result = await pool.query(facilityQueries.deleteFacility, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Facility not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Facility deleted successfully.',
    });
  } catch (err) {
    console.error('DeleteFacility error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  getAvailableFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
};

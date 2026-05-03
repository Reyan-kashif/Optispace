const pool = require('../config/db');
const bookingQueries = require('../queries/bookingQueries');

const getMyBookings = async (req, res) => {
  try {
    const result = await pool.query(bookingQueries.getMyBookings, [req.user.user_id]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Booking history retrieved successfully.',
    });
  } catch (err) {
    console.error('GetMyBookings error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query(bookingQueries.getPendingRequests);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Pending requests retrieved successfully.',
    });
  } catch (err) {
    console.error('GetPendingRequests error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const getActiveBookings = async (req, res) => {
  try {
    const result = await pool.query(bookingQueries.getActiveBookings);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: 'Active bookings retrieved successfully.',
    });
  } catch (err) {
    console.error('GetActiveBookings error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { facility_id, start_time, end_time, purpose, attendees_count } = req.body;

    if (!facility_id || !start_time || !end_time || !purpose) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Facility, start time, end time, and purpose are required.',
      });
    }

    if (new Date(start_time) < new Date()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Cannot book a facility in the past. Please select a future date and time.',
      });
    }

    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'End time must be after start time.',
      });
    }

    // Check facility is available for booking
    const facilityCheck = await pool.query(
      'SELECT is_available FROM facilities WHERE facility_id = $1',
      [facility_id]
    );
    if (facilityCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Facility not found.',
      });
    }
    if (!facilityCheck.rows[0].is_available) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'This facility is currently unavailable for booking.',
      });
    }

    // Conflict check against approved bookings
    const conflictResult = await pool.query(bookingQueries.checkConflict, [
      facility_id,
      start_time,
      end_time,
    ]);

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        data: { conflicts: conflictResult.rows },
        message: 'Time slot conflict. The facility is already booked during this period.',
      });
    }

    const result = await pool.query(bookingQueries.createBookingRequest, [
      req.user.user_id,
      facility_id,
      start_time,
      end_time,
      purpose,
      attendees_count || null,
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Booking request submitted successfully.',
    });
  } catch (err) {
    console.error('CreateBooking error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getMyBookings,
  getPendingRequests,
  getActiveBookings,
  createBooking,
};

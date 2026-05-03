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

const approveBooking = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { remarks } = req.body;

    // Verify the request exists and is pending
    const requestResult = await client.query(bookingQueries.getBookingRequestById, [id]);

    if (requestResult.rows.length === 0) {
      client.release();
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Booking request not found.',
      });
    }

    const request = requestResult.rows[0];

    if (request.status !== 'Pending') {
      client.release();
      return res.status(400).json({
        success: false,
        data: null,
        message: `Cannot approve a request with status: ${request.status}.`,
      });
    }

    // T1 Transaction: Approve booking
    await client.query('BEGIN');

    // Re-check for conflicts inside the transaction to prevent race conditions
    const conflictResult = await client.query(bookingQueries.checkConflict, [
      request.facility_id,
      request.start_time,
      request.end_time,
    ]);

    if (conflictResult.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(409).json({
        success: false,
        data: { conflicts: conflictResult.rows },
        message: 'Time slot conflict. Another booking was approved for this period.',
      });
    }

    // Step 1: Update booking_requests status to Approved
    await client.query(bookingQueries.updateBookingStatus, ['Approved', id]);

    // Step 2: Insert into approved_bookings from booking_requests
    const approvedResult = await client.query(bookingQueries.insertApprovedBooking, [id]);

    // Step 3: Insert approval record
    await client.query(bookingQueries.insertApprovalRecord, [
      id,
      req.user.user_id,
      'Approved',
      remarks || null,
    ]);

    await client.query('COMMIT');
    client.release();

    return res.status(200).json({
      success: true,
      data: approvedResult.rows[0],
      message: 'Booking approved successfully.',
    });
  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    console.error('ApproveBooking error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error. Transaction rolled back.',
    });
  }
};

module.exports = {
  getMyBookings,
  getPendingRequests,
  getActiveBookings,
  createBooking,
  approveBooking,
};


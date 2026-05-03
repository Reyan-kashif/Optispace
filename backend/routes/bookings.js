const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/roles');

// All booking routes require authentication
router.use(authenticate);

// GET /api/bookings/mine
router.get('/mine', bookingController.getMyBookings);

// GET /api/bookings/pending (Admin only)
router.get('/pending', authorizeAdmin, bookingController.getPendingRequests);

// GET /api/bookings/active
router.get('/active', bookingController.getActiveBookings);

// GET /api/bookings/history (Admin only)
router.get('/history', authorizeAdmin, bookingController.getBookingHistory);

// POST /api/bookings
router.post('/', bookingController.createBooking);

// PUT /api/bookings/:id/approve (Admin only)
router.put('/:id/approve', authorizeAdmin, bookingController.approveBooking);

// PUT /api/bookings/:id/reject (Admin only)
router.put('/:id/reject', authorizeAdmin, bookingController.rejectBooking);

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;

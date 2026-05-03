const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authenticate = require('../middleware/auth');

// All recommendation routes require authentication
router.use(authenticate);

// GET /api/recommendations/least-used
router.get('/least-used', recommendationController.getLeastUsed);

// GET /api/recommendations/best-slots/:facilityId
router.get('/best-slots/:facilityId', recommendationController.getBestSlots);

// GET /api/recommendations/similar/:facilityId
router.get('/similar/:facilityId', recommendationController.getSimilarFacilities);

// GET /api/recommendations/by-department
router.get('/by-department', recommendationController.getByDepartment);

// GET /api/recommendations/next-slot/:facilityId
router.get('/next-slot/:facilityId', recommendationController.getNextSlot);

module.exports = router;

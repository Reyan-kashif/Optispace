const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const authenticate = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/roles');

// Public-ish routes (still require auth)
router.get('/available', authenticate, facilityController.getAvailableFacilities);
router.get('/', authenticate, facilityController.getAllFacilities);
router.get('/:id', authenticate, facilityController.getFacilityById);

// Admin-only routes
router.post('/', authenticate, authorizeAdmin, facilityController.createFacility);
router.put('/:id', authenticate, authorizeAdmin, facilityController.updateFacility);
router.delete('/:id', authenticate, authorizeAdmin, facilityController.deleteFacility);

module.exports = router;

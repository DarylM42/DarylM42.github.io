const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const ctrlTrips = require('../controllers/trips');
const authCtrl = require('../controllers/auth');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// Shared validation rules for create/update trip payloads.
const tripValidationRules = [
	body('code').trim().notEmpty().withMessage('code is required'),
	body('name').trim().notEmpty().withMessage('name is required'),
	body('start').isISO8601().withMessage('start must be a valid ISO-8601 date'),
	body('description').trim().notEmpty().withMessage('description is required'),
	body('length').isInt({ min: 1 }).withMessage('length must be a positive integer'),
	body('price').isFloat({ min: 0 }).withMessage('price must be a non-negative number')
];

const tripCodeValidation = [
	param('tripCode').trim().notEmpty().withMessage('tripCode is required')
];

// Public routes
router.get('/trips', ctrlTrips.tripsList);
router.get('/trips/:tripCode', ctrlTrips.tripsFindByCode);

// Login route
router.post('/login', authCtrl.login);

// Protected admin routes
router.post('/trips', requireAuth, requireRole('admin'), tripValidationRules, ctrlTrips.tripsCreate);
router.put('/trips/:tripCode', requireAuth, requireRole('admin'), tripCodeValidation, tripValidationRules, ctrlTrips.tripsUpdateOne);
router.delete('/trips/:tripCode', requireAuth, requireRole('admin'), tripCodeValidation, ctrlTrips.tripsDeleteOne);

module.exports = router;

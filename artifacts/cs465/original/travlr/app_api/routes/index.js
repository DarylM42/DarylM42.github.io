const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/trips');

// GET all trips
router
  .route('/trips')
  .get(ctrlTrips.tripsList)
  .post(ctrlTrips.tripsCreate);

// GET, UPDATE, DELETE a single trip
  router
  .route('/trips/:tripCode')
  .get(ctrlTrips.tripsFindByCode)
  .put(ctrlTrips.tripsUpdateOne)
  .delete(ctrlTrips.tripsDeleteOne);

module.exports = router;

const express = require('express');
const router = express.Router();
const ctrlTravel = require('../controllers/travel');

router.get('/', ctrlTravel.travelList);
router.get('/:tripCode', ctrlTravel.travelDetail);

module.exports = router;

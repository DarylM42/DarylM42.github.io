const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meals');

router.get('/', mealsController.mealsList);
router.get('/json/:mealCode', mealsController.mealsDetailJson);
router.get('/:mealCode', mealsController.mealsDetail);

module.exports = router;

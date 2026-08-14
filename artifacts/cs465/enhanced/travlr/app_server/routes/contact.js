const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');

router.get('/', contactController.contactPage);

module.exports = router;

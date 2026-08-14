const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms');

router.get('/', roomsController.roomsList);
router.get('/json/:roomCode', roomsController.roomsDetailJson);
router.get('/:roomCode', roomsController.roomsDetail);

module.exports = router;

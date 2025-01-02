const express = require('express');
const router = express.Router();
const componentMovementController = require('../controllers/componentMovementController');

router.post('/', componentMovementController.createComponentMovement);
router.get('/', componentMovementController.getComponentMovements);

module.exports = router;

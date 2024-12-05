// routes/requestDetailRoutes.js
const express = require('express');
const router = express.Router();
const requestDetailController = require('../controllers/requestDetailController');

router.post('/', requestDetailController.createRequestDetail);
router.get('/', requestDetailController.getAllRequestDetails);
router.get('/:id', requestDetailController.getRequestDetailById);
router.put('/:id', requestDetailController.updateRequestDetail);
router.delete('/:id', requestDetailController.deleteRequestDetail);

module.exports = router;

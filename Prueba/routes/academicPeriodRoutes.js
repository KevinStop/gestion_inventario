const express = require('express');
const router = express.Router();
const academicPeriodController = require('../controllers/academicPeriodController');

router.post('/', academicPeriodController.createAcademicPeriod);
router.get('/', academicPeriodController.getAllAcademicPeriods);
router.get('/:id', academicPeriodController.getAcademicPeriodById);
router.put('/:id', academicPeriodController.updateAcademicPeriod);
router.delete('/:id', academicPeriodController.deleteAcademicPeriod);
router.put('/:id/activate', academicPeriodController.setActiveAcademicPeriod);
router.get('/:periodId/reports', academicPeriodController.getPeriodReports);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getHospitals, getHospitalById, createHospital } = require('../controllers/hospitalController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', getHospitals);
router.get('/:id', getHospitalById);
router.post('/', protect, authorize('admin'), createHospital);

module.exports = router;

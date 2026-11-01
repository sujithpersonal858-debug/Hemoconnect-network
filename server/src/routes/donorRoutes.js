const express = require('express');
const router = express.Router();
const { searchDonors, getDonorById, toggleAvailability, logDonation } = require('../controllers/donorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', searchDonors);
router.get('/:id', getDonorById);
router.put('/availability', protect, authorize('donor'), toggleAvailability);
router.post('/log-donation', protect, authorize('donor'), logDonation);

module.exports = router;

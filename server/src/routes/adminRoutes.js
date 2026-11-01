const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllDonors,
  verifyDonor,
  getAllUsers,
  getAllSeekers,
  getAllRequestsAdmin,
  updateRequestStatusAdmin
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes strictly protected for 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/donors', getAllDonors);
router.put('/donors/:userId/verify', verifyDonor);
router.get('/users', getAllUsers);
router.get('/seekers', getAllSeekers);
router.get('/requests', getAllRequestsAdmin);
router.put('/requests/:id/status', updateRequestStatusAdmin);

module.exports = router;

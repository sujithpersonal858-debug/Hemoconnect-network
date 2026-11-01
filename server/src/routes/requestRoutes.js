const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getMyRequests, updateStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', getRequests);
router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id/status', protect, updateStatus);

module.exports = router;

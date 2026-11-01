const BloodRequest = require('../models/BloodRequest');

// @desc    Create new emergency blood request (SOS)
// @route   POST /api/requests
// @access  Private (Seeker, Donor, Admin)
exports.createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalName,
      hospitalAddress,
      state,
      district,
      urgency,
      contactName,
      contactPhone,
      caseNotes
    } = req.body;

    const newRequest = await BloodRequest.create({
      requester: req.user._id,
      patientName,
      bloodGroup,
      unitsNeeded: unitsNeeded || 1,
      hospitalName,
      hospitalAddress,
      state,
      district,
      urgency: urgency || 'Urgent - Within 6 Hours',
      contactName: contactName || req.user.name,
      contactPhone: contactPhone || req.user.phone,
      caseNotes,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Emergency SOS Blood Request Broadcasted',
      request: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error broadcasting emergency blood request'
    });
  }
};

// @desc    Get all active emergency requests
// @route   GET /api/requests
// @access  Public
exports.getRequests = async (req, res) => {
  try {
    const { bloodGroup, state, district, urgency, status } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'Active'; // Default to active requests
    }

    if (bloodGroup && bloodGroup !== 'ALL') {
      query.bloodGroup = bloodGroup;
    }

    if (state && state !== 'ALL') {
      query.state = state;
    }

    if (district && district !== 'ALL') {
      query.district = new RegExp(district, 'i');
    }

    if (urgency && urgency !== 'ALL') {
      query.urgency = urgency;
    }

    const requests = await BloodRequest.find(query)
      .populate('requester', 'name phone isDemoRecord')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blood requests'
    });
  }
};

// @desc    Get user's own requests
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your blood requests' });
  }
};

// @desc    Update request status (Fulfill / Cancel)
// @route   PUT /api/requests/:id/status
// @access  Private (Requester or Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    // Check ownership or admin
    if (bloodRequest.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    bloodRequest.status = status;
    await bloodRequest.save();

    res.json({
      success: true,
      message: `Request marked as ${status}`,
      request: bloodRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update request status' });
  }
};

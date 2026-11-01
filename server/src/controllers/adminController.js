const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');

// @desc    Get complete administrative dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await DonorProfile.countDocuments();
    const availableDonors = await DonorProfile.countDocuments({ isAvailable: true });
    const verifiedDonors = await User.countDocuments({ role: 'donor', isVerified: true });
    const totalRequests = await BloodRequest.countDocuments();
    const activeRequests = await BloodRequest.countDocuments({ status: 'Active' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });
    const totalHospitals = await Hospital.countDocuments();

    // Group donors by blood group
    const donorsByBloodGroup = await DonorProfile.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Group requests by state
    const requestsByState = await BloodRequest.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        availableDonors,
        verifiedDonors,
        totalRequests,
        activeRequests,
        fulfilledRequests,
        totalHospitals,
        donorsByBloodGroup,
        requestsByState
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to aggregate administrative stats' });
  }
};

// @desc    Get all registered donors for admin verification
// @route   GET /api/admin/donors
// @access  Private (Admin only)
exports.getAllDonors = async (req, res) => {
  try {
    const donors = await DonorProfile.find()
      .populate('user', 'name email phone state district isVerified isDemoRecord createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donors.length, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve donors list' });
  }
};

// @desc    Verify or toggle verification of a donor
// @route   PUT /api/admin/donors/:userId/verify
// @access  Private (Admin only)
exports.verifyDonor = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !user.isVerified;
    await user.save();

    res.json({
      success: true,
      message: `Donor verification status changed to: ${user.isVerified ? 'Verified' : 'Unverified'}`,
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update verification status' });
  }
};

// @desc    Get all users (admin overview)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// @desc    Get all registered seekers
// @route   GET /api/admin/seekers
// @access  Private (Admin only)
exports.getAllSeekers = async (req, res) => {
  try {
    const seekers = await User.find({ role: 'seeker' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: seekers.length, seekers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch seekers' });
  }
};

// @desc    Get all blood requests for admin
// @route   GET /api/admin/requests
// @access  Private (Admin only)
exports.getAllRequestsAdmin = async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
};

// @desc    Update request status as admin
// @route   PUT /api/admin/requests/:id/status
// @access  Private (Admin only)
exports.updateRequestStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }
    request.status = status;
    await request.save();
    res.json({ success: true, message: `Request status updated to ${status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update request status' });
  }
};

const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

// Blood compatibility mapping: given a recipient blood group, who can donate to them?
const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor
};

// @desc    Search and match donors
// @route   GET /api/donors
// @access  Public
exports.searchDonors = async (req, res) => {
  try {
    const { bloodGroup, recipientBloodGroup, state, district, availableOnly } = req.query;

    const query = {};

    // Filter by specific donor blood group OR compatible donors for a recipient
    if (bloodGroup && bloodGroup !== 'ALL') {
      query.bloodGroup = bloodGroup;
    } else if (recipientBloodGroup && COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodGroup]) {
      query.bloodGroup = { $in: COMPATIBLE_DONORS_FOR_RECIPIENT[recipientBloodGroup] };
    }

    if (state && state !== 'ALL') {
      query.state = state;
    }

    if (district && district !== 'ALL') {
      query.district = new RegExp(district, 'i');
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    const donors = await DonorProfile.find(query)
      .populate('user', 'name phone email isVerified isDemoRecord')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    console.error('Donor search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donors'
    });
  }
};

// @desc    Get donor profile by ID
// @route   GET /api/donors/:id
// @access  Public
exports.getDonorById = async (req, res) => {
  try {
    const donor = await DonorProfile.findById(req.params.id).populate('user', 'name phone email isVerified isDemoRecord');
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }
    res.json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving donor' });
  }
};

// @desc    Update current donor availability & profile
// @route   PUT /api/donors/availability
// @access  Private (Donor only)
exports.toggleAvailability = async (req, res) => {
  try {
    let donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    donor.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : !donor.isAvailable;
    await donor.save();

    res.json({
      success: true,
      message: `Availability updated to ${donor.isAvailable ? 'Available' : 'Unavailable'}`,
      donor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating availability' });
  }
};

// @desc    Log a completed blood donation
// @route   POST /api/donors/log-donation
// @access  Private (Donor only)
exports.logDonation = async (req, res) => {
  try {
    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    donor.donationsCount = (donor.donationsCount || 0) + 1;
    donor.lastDonationDate = new Date();
    await donor.save();

    res.json({
      success: true,
      message: 'Donation recorded successfully. Thank you for saving lives!',
      donor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recording donation' });
  }
};

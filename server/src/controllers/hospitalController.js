const Hospital = require('../models/Hospital');

// @desc    Get hospital & blood bank directory
// @route   GET /api/hospitals
// @access  Public
exports.getHospitals = async (req, res) => {
  try {
    const { state, district, category, bloodGroup } = req.query;

    const query = {};

    if (state && state !== 'ALL') {
      query.state = state;
    }

    if (district && district !== 'ALL') {
      query.district = new RegExp(district, 'i');
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (bloodGroup && bloodGroup !== 'ALL') {
      query.availableBloodGroups = bloodGroup;
    }

    const facilities = await Hospital.find(query).sort({ state: 1, district: 1, name: 1 });

    res.json({
      success: true,
      count: facilities.length,
      facilities
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve healthcare facilities'
    });
  }
};

// @desc    Get single hospital details
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospitalById = async (req, res) => {
  try {
    const facility = await Hospital.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving facility details' });
  }
};

// @desc    Add new hospital / blood bank
// @route   POST /api/hospitals
// @access  Private (Admin only)
exports.createHospital = async (req, res) => {
  try {
    const facility = await Hospital.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Facility added successfully',
      facility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating facility'
    });
  }
};

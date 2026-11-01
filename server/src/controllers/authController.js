const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const jwt = require('jsonwebtoken');

// Generate JWT helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hemoconnect_fallback_secret_key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (donor or seeker)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, state, district, bloodGroup, age, gender, weightKg } = req.body;

    // Disallow registering directly as admin through public registration
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator accounts cannot be created via public registration'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const assignedRole = role === 'donor' ? 'donor' : 'seeker';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      state,
      district
    });

    // If user registered as a donor, create their donor profile
    let donorProfile = null;
    if (assignedRole === 'donor') {
      donorProfile = await DonorProfile.create({
        user: user._id,
        bloodGroup: bloodGroup || 'O+',
        age: age ? Number(age) : 25,
        gender: gender || 'Other',
        weightKg: weightKg ? Number(weightKg) : 55,
        state,
        district,
        isAvailable: true
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified
      },
      donorProfile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// In-memory rate limiting and protection against repeated failed login attempts
const loginAttempts = new Map(); // email/ip -> { count, lockedUntil }

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const clientKey = `${normalizedEmail}_${req.ip || 'ip'}`;
    const attemptRecord = loginAttempts.get(clientKey);

    // Check if account/IP is temporarily locked due to repeated failed attempts
    if (attemptRecord && attemptRecord.lockedUntil && attemptRecord.lockedUntil > Date.now()) {
      const minutesRemaining = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Security Lockout: Too many failed login attempts. Please wait ${minutesRemaining} minute(s) before trying again.`
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      // Record failed attempt
      const current = attemptRecord ? attemptRecord.count + 1 : 1;
      const lockedUntil = current >= 5 ? Date.now() + 10 * 60 * 1000 : null; // 10 min lockout after 5 fails
      loginAttempts.set(clientKey, { count: current, lockedUntil });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Record failed attempt
      const current = attemptRecord ? attemptRecord.count + 1 : 1;
      const lockedUntil = current >= 5 ? Date.now() + 10 * 60 * 1000 : null;
      loginAttempts.set(clientKey, { count: current, lockedUntil });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Login succeeded: Clear failed attempts
    loginAttempts.delete(clientKey);

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await DonorProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified
      },
      donorProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user profile & donor profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let donorProfile = null;

    if (user.role === 'donor') {
      donorProfile = await DonorProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified
      },
      donorProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

// @desc    Update current user profile & donor profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, state, district, bloodGroup, age, weightKg, gender } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (state) user.state = state;
    if (district) user.district = district;
    await user.save();

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await DonorProfile.findOne({ user: user._id });
      if (donorProfile) {
        if (bloodGroup) donorProfile.bloodGroup = bloodGroup;
        if (age) donorProfile.age = Number(age);
        if (weightKg) donorProfile.weightKg = Number(weightKg);
        if (gender) donorProfile.gender = gender;
        if (state) donorProfile.state = state;
        if (district) donorProfile.district = district;
        await donorProfile.save();
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        state: user.state,
        district: user.district,
        isVerified: user.isVerified
      },
      donorProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile'
    });
  }
};

// @desc    Change user account password securely
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and a new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Your account is secured.'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again.'
    });
  }
};

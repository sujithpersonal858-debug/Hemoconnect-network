const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please specify blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor must be under 65 years old']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  weightKg: {
    type: Number,
    min: 45
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  donationsCount: {
    type: Number,
    default: 0
  },
  medicalClearance: {
    type: Boolean,
    default: true
  },
  isDemoRecord: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DonorProfile', donorProfileSchema);

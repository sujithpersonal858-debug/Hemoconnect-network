const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Hospital', 'Blood Bank', 'Emergency Center', 'Red Cross Center'],
    default: 'Hospital'
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
  address: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  emergencyAvailable24x7: {
    type: Boolean,
    default: true
  },
  availableBloodGroups: [{
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  }],
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDemoRecord: {
    type: Boolean,
    default: false
  },
  disclaimer: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);

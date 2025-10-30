// backend/models/Pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide pet name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide pet type'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['Lost', 'Found']
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 1000
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  city: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact info']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please upload an image']
  },
  cloudinaryId: {
    type: String
  },
  lastSeenDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search optimization
PetSchema.index({ city: 1, type: 1, status: 1 });
PetSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Pet', PetSchema);
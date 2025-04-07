const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  game: {
    type: String,
    enum: ['CS2', 'Rust', 'SAMP'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'terminated'],
    default: 'active'
  },
  plan: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  slots: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Server', ServerSchema); 
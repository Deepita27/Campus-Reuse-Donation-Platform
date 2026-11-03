const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    message: {
      type: String,
      trim: true,
      default: 'I would like to request this item. Please let me know if it is available.'
    },
    donorNote: {
      type: String,
      default: ''
    },
    pickupTime: {
      type: String,
      default: ''
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent same requester from creating multiple active requests for the same item
requestSchema.index({ item: 1, requester: 1 });

module.exports = mongoose.model('Request', requestSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'REQUEST_RECEIVED',
        'REQUEST_ACCEPTED',
        'REQUEST_REJECTED',
        'REQUEST_COMPLETED',
        'ITEM_APPROVED',
        'ITEM_REJECTED',
        'ITEM_CANCELLED',
        'GENERAL'
      ],
      default: 'GENERAL'
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    link: {
      type: String,
      default: '/'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

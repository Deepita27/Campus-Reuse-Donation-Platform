const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Please enter item title/name'],
      trim: true,
      maxlength: [120, 'Item name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Books & Study Materials',
        'Electronics',
        'Stationery',
        'Clothing',
        'Lab Equipment',
        'Sports Equipment',
        'Furniture',
        'Others'
      ]
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair']
    },
    image: {
      type: String,
      required: [true, 'Please provide an item image']
    },
    pickupLocation: {
      type: String,
      required: [true, 'Please enter a campus pickup location (e.g. Library Front, Block A, Cafeteria)'],
      trim: true
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    donorName: {
      type: String,
      default: ''
    },
    donorDepartment: {
      type: String,
      default: ''
    },
    donorEmail: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    availability: {
      type: String,
      enum: ['Available', 'Reserved', 'Completed'],
      default: 'Available'
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high performance searching and filtering
itemSchema.index({ itemName: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1, availability: 1 });
itemSchema.index({ donor: 1 });

module.exports = mongoose.model('Item', itemSchema);

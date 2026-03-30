const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: 0,
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);

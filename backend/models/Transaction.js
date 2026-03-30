const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    bid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agreedPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'arranged', 'in_transit', 'delivered', 'failed'],
      default: 'pending',
    },
    storageStatus: {
      type: String,
      enum: ['not_required', 'pending', 'arranged', 'active', 'completed'],
      default: 'not_required',
    },
    transactionStatus: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'disputed'],
      default: 'active',
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

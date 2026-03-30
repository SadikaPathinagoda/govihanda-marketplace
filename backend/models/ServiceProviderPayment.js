const mongoose = require('mongoose');

const serviceProviderPaymentSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'online'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceProviderPayment', serviceProviderPaymentSchema);

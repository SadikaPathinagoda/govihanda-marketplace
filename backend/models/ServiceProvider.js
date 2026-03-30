const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: ['transport', 'cold_storage', 'both'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    coverageArea: [
      {
        type: String,
      },
    ],
    pricingDetails: {
      type: String,
    },
    vehicleDetails: {
      vehicleType: String,
      vehicleCount: Number,
      capacity: String,
    },
    storageCapacity: {
      totalCapacity: String,
      unit: String,
      temperatureRange: String,
    },
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);

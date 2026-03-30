const mongoose = require('mongoose');

const marketInfoSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    averagePrice: {
      type: Number,
      required: [true, 'Average price is required'],
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    demandLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    trend: {
      type: String,
      enum: ['rising', 'stable', 'falling'],
      required: true,
    },
    source: {
      type: String,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketInfo', marketInfoSchema);

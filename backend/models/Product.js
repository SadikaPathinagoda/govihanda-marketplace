const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Vegetables', 'Fruits', 'Grains', 'Legumes',
        'Spices', 'Tubers', 'Herbs', 'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'g', 'lbs', 'ton', 'bushel', 'crate', 'bag', 'piece'],
    },
    quality: {
      type: String,
      required: [true, 'Quality is required'],
      enum: ['Grade A', 'Grade B', 'Grade C', 'Organic', 'Standard'],
    },
    expectedPrice: {
      type: Number,
      required: [true, 'Expected price is required'],
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    harvestDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['open', 'sold', 'closed'],
      default: 'open',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    isModerated: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ratingSchema.pre('save', function (next) {
  if (!this.targetUser && !this.targetProvider) {
    return next(new Error('Rating must target a user or service provider'));
  }
  next();
});

module.exports = mongoose.model('Rating', ratingSchema);

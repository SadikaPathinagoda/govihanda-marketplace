const asyncHandler = require('express-async-handler');
const Rating = require('../models/Rating');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Transaction = require('../models/Transaction');

// @desc    Submit a rating
// @route   POST /api/ratings
// @access  Private
const submitRating = asyncHandler(async (req, res) => {
  const { targetUserId, targetProviderId, transactionId, rating, review } = req.body;

  // Verify transaction exists and reviewer is participant
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const isParticipant =
    transaction.farmer.toString() === req.user._id.toString() ||
    transaction.buyer.toString() === req.user._id.toString();

  if (!isParticipant) {
    res.status(403);
    throw new Error('You are not a participant in this transaction');
  }

  // Prevent duplicate rating
  const existing = await Rating.findOne({
    reviewer: req.user._id,
    transaction: transactionId,
    ...(targetUserId ? { targetUser: targetUserId } : {}),
    ...(targetProviderId ? { targetProvider: targetProviderId } : {}),
  });

  if (existing) {
    res.status(400);
    throw new Error('You have already rated this user for this transaction');
  }

  const newRating = await Rating.create({
    reviewer: req.user._id,
    targetUser: targetUserId,
    targetProvider: targetProviderId,
    transaction: transactionId,
    rating,
    review,
  });

  // Update average rating on target
  if (targetUserId) {
    const ratings = await Rating.find({ targetUser: targetUserId, isHidden: false });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await User.findByIdAndUpdate(targetUserId, { averageRating: avg.toFixed(1), totalRatings: ratings.length });
  }

  if (targetProviderId) {
    const ratings = await Rating.find({ targetProvider: targetProviderId, isHidden: false });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await ServiceProvider.findByIdAndUpdate(targetProviderId, { averageRating: avg.toFixed(1), totalRatings: ratings.length });
  }

  res.status(201).json(newRating);
});

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
const getUserRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ targetUser: req.params.userId, isHidden: false })
    .populate('reviewer', 'name profileImage role')
    .sort('-createdAt');

  res.json(ratings);
});

// @desc    Get ratings for a provider
// @route   GET /api/ratings/provider/:providerId
// @access  Public
const getProviderRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ targetProvider: req.params.providerId, isHidden: false })
    .populate('reviewer', 'name profileImage role')
    .sort('-createdAt');

  res.json(ratings);
});

// @desc    Hide/unhide a rating (admin moderation)
// @route   PUT /api/ratings/:id/moderate
// @access  Private/Admin
const moderateRating = asyncHandler(async (req, res) => {
  const { isHidden } = req.body;
  const rating = await Rating.findByIdAndUpdate(req.params.id, { isHidden, isModerated: true }, { new: true });

  if (!rating) {
    res.status(404);
    throw new Error('Rating not found');
  }

  res.json(rating);
});

module.exports = { submitRating, getUserRatings, getProviderRatings, moderateRating };

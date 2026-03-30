const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update current user
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, district, profileImage } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address, district, profileImage },
    { new: true, runValidators: true }
  );

  res.json(user);
});

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'name role district profileImage averageRating totalRatings createdAt'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(Number(limit)).sort('-createdAt'),
    User.countDocuments(filter),
  ]);

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Activate / deactivate user (admin)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const setUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

module.exports = { getMe, updateMe, getUserById, getAllUsers, setUserStatus };

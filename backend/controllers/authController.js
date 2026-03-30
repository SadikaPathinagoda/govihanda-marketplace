const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, address, district } = req.body;

  const allowedRoles = ['farmer', 'buyer', 'provider'];
  if (role && !allowedRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone, role: role || 'buyer', address, district });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    district: user.district,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account is deactivated. Contact admin.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    district: user.district,
    profileImage: user.profileImage,
    isVerified: user.isVerified,
    token: generateToken(user._id),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getProfile };

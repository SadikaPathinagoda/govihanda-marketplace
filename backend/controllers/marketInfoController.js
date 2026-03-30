const asyncHandler = require('express-async-handler');
const MarketInfo = require('../models/MarketInfo');

// @desc    Get all market info
// @route   GET /api/market-info
// @access  Public
const getMarketInfo = asyncHandler(async (req, res) => {
  const { district, cropName, demandLevel, trend } = req.query;
  const filter = {};

  if (district) filter.district = district;
  if (cropName) filter.cropName = new RegExp(cropName, 'i');
  if (demandLevel) filter.demandLevel = demandLevel;
  if (trend) filter.trend = trend;

  const data = await MarketInfo.find(filter)
    .populate('addedBy', 'name')
    .sort('-updatedAt');

  res.json(data);
});

// @desc    Create market info record
// @route   POST /api/market-info
// @access  Private/Admin
const createMarketInfo = asyncHandler(async (req, res) => {
  const record = await MarketInfo.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json(record);
});

// @desc    Update market info record
// @route   PUT /api/market-info/:id
// @access  Private/Admin
const updateMarketInfo = asyncHandler(async (req, res) => {
  const record = await MarketInfo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    res.status(404);
    throw new Error('Market info record not found');
  }

  res.json(record);
});

// @desc    Delete market info record
// @route   DELETE /api/market-info/:id
// @access  Private/Admin
const deleteMarketInfo = asyncHandler(async (req, res) => {
  const record = await MarketInfo.findByIdAndDelete(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }
  res.json({ message: 'Record removed' });
});

module.exports = { getMarketInfo, createMarketInfo, updateMarketInfo, deleteMarketInfo };

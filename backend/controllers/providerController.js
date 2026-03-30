const asyncHandler = require('express-async-handler');
const ServiceProvider = require('../models/ServiceProvider');

// @desc    Register as service provider
// @route   POST /api/providers/register
// @access  Private/Provider
const registerProvider = asyncHandler(async (req, res) => {
  const exists = await ServiceProvider.findOne({ user: req.user._id });
  if (exists) {
    res.status(400);
    throw new Error('You already have a provider profile');
  }

  // Whitelist allowed fields — prevent providers from self-approving
  const {
    businessName, serviceType, description, coverageArea,
    pricingDetails, vehicleDetails, storageCapacity,
    contactPhone, contactEmail,
  } = req.body;

  const provider = await ServiceProvider.create({
    user: req.user._id,
    businessName, serviceType, description, coverageArea,
    pricingDetails, vehicleDetails, storageCapacity,
    contactPhone, contactEmail,
  });
  res.status(201).json(provider);
});

// @desc    Get all approved providers
// @route   GET /api/providers
// @access  Public
const getProviders = asyncHandler(async (req, res) => {
  const { serviceType, district, page = 1, limit = 12 } = req.query;
  const filter = { approvalStatus: 'approved', isAvailable: true };

  if (serviceType) filter.serviceType = { $in: [serviceType, 'both'] };
  if (district) filter.coverageArea = district;

  const skip = (Number(page) - 1) * Number(limit);
  const [providers, total] = await Promise.all([
    ServiceProvider.find(filter)
      .populate('user', 'name district profileImage')
      .sort('-averageRating')
      .skip(skip)
      .limit(Number(limit)),
    ServiceProvider.countDocuments(filter),
  ]);

  res.json({ providers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Get single provider
// @route   GET /api/providers/:id
// @access  Public
const getProviderById = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findById(req.params.id).populate('user', 'name district profileImage phone');

  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  res.json(provider);
});

// @desc    Update own provider profile
// @route   PUT /api/providers/:id
// @access  Private/Provider (owner)
const updateProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findById(req.params.id);

  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  if (provider.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Whitelist updatable fields — prevent self-approval via body
  const {
    businessName, serviceType, description, coverageArea,
    pricingDetails, vehicleDetails, storageCapacity,
    contactPhone, contactEmail, isAvailable,
  } = req.body;

  const safeUpdate = {
    businessName, serviceType, description, coverageArea,
    pricingDetails, vehicleDetails, storageCapacity,
    contactPhone, contactEmail, isAvailable,
  };
  // Strip undefined keys so Mongoose doesn't overwrite fields with undefined
  Object.keys(safeUpdate).forEach((k) => safeUpdate[k] === undefined && delete safeUpdate[k]);

  const updated = await ServiceProvider.findByIdAndUpdate(req.params.id, safeUpdate, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Approve provider (admin)
// @route   PUT /api/providers/:id/approve
// @access  Private/Admin
const approveProvider = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    {
      $set: { approvalStatus: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
      $unset: { rejectionReason: '' },
    },
    { new: true }
  );

  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  res.json(provider);
});

// @desc    Reject provider (admin)
// @route   PUT /api/providers/:id/reject
// @access  Private/Admin
const rejectProvider = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const provider = await ServiceProvider.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: 'rejected', rejectionReason: reason },
    { new: true }
  );

  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  res.json(provider);
});

// @desc    Get all providers (admin, includes pending/rejected)
// @route   GET /api/providers/admin/all
// @access  Private/Admin
const getAllProvidersAdmin = asyncHandler(async (req, res) => {
  const { approvalStatus, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (approvalStatus) filter.approvalStatus = approvalStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [providers, total] = await Promise.all([
    ServiceProvider.find(filter)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    ServiceProvider.countDocuments(filter),
  ]);

  res.json({ providers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Get own provider profile
// @route   GET /api/providers/my
// @access  Private/Provider
const getMyProviderProfile = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });
  if (!provider) {
    res.status(404);
    throw new Error('Provider profile not found');
  }
  res.json(provider);
});

module.exports = {
  registerProvider,
  getProviders,
  getProviderById,
  updateProvider,
  approveProvider,
  rejectProvider,
  getAllProvidersAdmin,
  getMyProviderProfile,
};

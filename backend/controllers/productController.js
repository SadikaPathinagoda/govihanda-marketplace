const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Create product listing
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = asyncHandler(async (req, res) => {
  const { title, category, description, quantity, unit, quality, expectedPrice, district, harvestDate } = req.body;

  // Cloudinary gives f.path as a full HTTPS URL.
  // Local disk storage gives f.path as a filesystem path — convert to a server URL.
  const images = req.files
    ? req.files.map((f) => ({
        url: f.path.startsWith('http')
          ? f.path
          : `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
        publicId: f.filename,
      }))
    : [];

  const product = await Product.create({
    farmer: req.user._id,
    title,
    category,
    description,
    quantity,
    unit,
    quality,
    expectedPrice,
    images,
    district,
    harvestDate,
  });

  res.status(201).json(product);
});

// @desc    Get all products (public + filters)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, district, quality, status = 'open', search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const filter = { status };

  if (category) filter.category = category;
  if (district) filter.district = district;
  if (quality) filter.quality = quality;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('farmer', 'name district profileImage averageRating')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('farmer', 'name district profileImage averageRating phone');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Farmer (owner)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this product');
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Farmer (owner) or Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const isOwner = product.farmer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Get farmer's own products
// @route   GET /api/products/my
// @access  Private/Farmer
const getMyProducts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;
  const filter = { farmer: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getMyProducts };

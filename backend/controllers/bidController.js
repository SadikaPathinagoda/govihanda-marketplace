const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private/Buyer
const placeBid = asyncHandler(async (req, res) => {
  const { productId, bidAmount, quantityRequested, message } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.status !== 'open') {
    res.status(400);
    throw new Error('Product is no longer available for bidding');
  }

  if (product.farmer.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot bid on your own product');
  }

  const bid = await Bid.create({
    product: productId,
    buyer: req.user._id,
    bidAmount,
    quantityRequested,
    message,
  });

  await bid.populate('buyer', 'name district profileImage');
  await bid.populate('product', 'title unit expectedPrice');

  res.status(201).json(bid);
});

// @desc    Get bids for a product (farmer sees these)
// @route   GET /api/bids/product/:productId
// @access  Private/Farmer (owner)
const getBidsForProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const bids = await Bid.find({ product: req.params.productId })
    .populate('buyer', 'name district profileImage averageRating phone')
    .sort('-createdAt');

  res.json(bids);
});

// @desc    Get buyer's own bids
// @route   GET /api/bids/my-bids
// @access  Private/Buyer
const getMyBids = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { buyer: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bids, total] = await Promise.all([
    Bid.find(filter)
      .populate('product', 'title category images district farmer')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Bid.countDocuments(filter),
  ]);

  res.json({ bids, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Accept a bid (farmer only)
// @route   PUT /api/bids/:id/accept
// @access  Private/Farmer
const acceptBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id).populate('product');

  if (!bid) {
    res.status(404);
    throw new Error('Bid not found');
  }

  if (bid.product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (bid.status !== 'pending') {
    res.status(400);
    throw new Error('Bid is no longer pending');
  }

  bid.status = 'accepted';
  await bid.save();

  // Create transaction
  const transaction = await Transaction.create({
    product: bid.product._id,
    bid: bid._id,
    farmer: req.user._id,
    buyer: bid.buyer,
    agreedPrice: bid.bidAmount,
    quantity: bid.quantityRequested,
    totalAmount: bid.bidAmount * bid.quantityRequested,
  });

  // Mark product as sold
  await Product.findByIdAndUpdate(bid.product._id, { status: 'sold' });

  // Reject all other pending bids for this product
  await Bid.updateMany(
    { product: bid.product._id, _id: { $ne: bid._id }, status: 'pending' },
    { status: 'rejected' }
  );

  res.json({ bid, transaction });
});

// @desc    Reject a bid (farmer only)
// @route   PUT /api/bids/:id/reject
// @access  Private/Farmer
const rejectBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id).populate('product');

  if (!bid) {
    res.status(404);
    throw new Error('Bid not found');
  }

  if (bid.product.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (bid.status !== 'pending') {
    res.status(400);
    throw new Error('Bid is no longer pending');
  }

  bid.status = 'rejected';
  await bid.save();

  res.json(bid);
});

// @desc    Withdraw a bid (buyer only)
// @route   PUT /api/bids/:id/withdraw
// @access  Private/Buyer
const withdrawBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id);

  if (!bid) {
    res.status(404);
    throw new Error('Bid not found');
  }

  if (bid.buyer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (bid.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending bids can be withdrawn');
  }

  bid.status = 'withdrawn';
  await bid.save();

  res.json(bid);
});

module.exports = { placeBid, getBidsForProduct, getMyBids, acceptBid, rejectBid, withdrawBid };

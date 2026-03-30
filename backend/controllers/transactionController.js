const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get my transactions (farmer or buyer)
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, transactionStatus } = req.query;
  const filter = {
    $or: [{ farmer: req.user._id }, { buyer: req.user._id }],
  };
  if (transactionStatus) filter.transactionStatus = transactionStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('product', 'title category images')
      .populate('farmer', 'name profileImage phone')
      .populate('buyer', 'name profileImage phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private (participants or admin)
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('product', 'title category images unit district')
    .populate('farmer', 'name profileImage phone district')
    .populate('buyer', 'name profileImage phone district')
    .populate('bid')
    .populate('serviceProvider');

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const isFarmer = transaction.farmer._id.toString() === req.user._id.toString();
  const isBuyer = transaction.buyer._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isFarmer && !isBuyer && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(transaction);
});

// @desc    Update transaction status fields
// @route   PUT /api/transactions/:id/status
// @access  Private (participants or admin)
const updateTransactionStatus = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  const isFarmer = transaction.farmer.toString() === req.user._id.toString();
  const isBuyer = transaction.buyer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isFarmer && !isBuyer && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { paymentStatus, deliveryStatus, storageStatus, transactionStatus, serviceProvider, notes } = req.body;

  if (paymentStatus) transaction.paymentStatus = paymentStatus;
  if (deliveryStatus) transaction.deliveryStatus = deliveryStatus;
  if (storageStatus) transaction.storageStatus = storageStatus;
  if (transactionStatus) transaction.transactionStatus = transactionStatus;
  if (serviceProvider) transaction.serviceProvider = serviceProvider;
  if (notes) transaction.notes = notes;

  const updated = await transaction.save();
  res.json(updated);
});

// @desc    Get all transactions (admin)
// @route   GET /api/transactions
// @access  Private/Admin
const getAllTransactions = asyncHandler(async (req, res) => {
  const { transactionStatus, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (transactionStatus) filter.transactionStatus = transactionStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate('farmer', 'name')
      .populate('buyer', 'name')
      .populate('product', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

module.exports = { getMyTransactions, getTransactionById, updateTransactionStatus, getAllTransactions };

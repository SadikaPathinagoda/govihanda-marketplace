const express = require('express');
const { getMyTransactions, getTransactionById, updateTransactionStatus, getAllTransactions } = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyTransactions);
router.get('/', protect, authorize('admin'), getAllTransactions);
router.get('/:id', protect, getTransactionById);
router.put('/:id/status', protect, updateTransactionStatus);

module.exports = router;

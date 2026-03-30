const express = require('express');
const { placeBid, getBidsForProduct, getMyBids, acceptBid, rejectBid, withdrawBid } = require('../controllers/bidController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('buyer'), placeBid);
router.get('/my-bids', protect, authorize('buyer'), getMyBids);
router.get('/product/:productId', protect, authorize('farmer', 'admin'), getBidsForProduct);
router.put('/:id/accept', protect, authorize('farmer'), acceptBid);
router.put('/:id/reject', protect, authorize('farmer'), rejectBid);
router.put('/:id/withdraw', protect, authorize('buyer'), withdrawBid);

module.exports = router;

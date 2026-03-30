const express = require('express');
const { submitRating, getUserRatings, getProviderRatings, moderateRating } = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitRating);
router.get('/user/:userId', getUserRatings);
router.get('/provider/:providerId', getProviderRatings);
router.put('/:id/moderate', protect, authorize('admin'), moderateRating);

module.exports = router;

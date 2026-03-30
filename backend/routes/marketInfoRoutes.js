const express = require('express');
const { getMarketInfo, createMarketInfo, updateMarketInfo, deleteMarketInfo } = require('../controllers/marketInfoController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMarketInfo);
router.post('/', protect, authorize('admin'), createMarketInfo);
router.put('/:id', protect, authorize('admin'), updateMarketInfo);
router.delete('/:id', protect, authorize('admin'), deleteMarketInfo);

module.exports = router;

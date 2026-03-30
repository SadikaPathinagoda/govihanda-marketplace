const express = require('express');
const {
  registerProvider,
  getProviders,
  getProviderById,
  updateProvider,
  approveProvider,
  rejectProvider,
  getAllProvidersAdmin,
  getMyProviderProfile,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProviders);
router.get('/my', protect, authorize('provider'), getMyProviderProfile);
router.get('/admin/all', protect, authorize('admin'), getAllProvidersAdmin);
router.post('/register', protect, authorize('provider'), registerProvider);
router.get('/:id', getProviderById);
router.put('/:id', protect, authorize('provider', 'admin'), updateProvider);
router.put('/:id/approve', protect, authorize('admin'), approveProvider);
router.put('/:id/reject', protect, authorize('admin'), rejectProvider);

module.exports = router;

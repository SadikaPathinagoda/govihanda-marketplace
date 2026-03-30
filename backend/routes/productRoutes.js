const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', getProducts);
router.get('/my', protect, authorize('farmer'), getMyProducts);
router.post('/', protect, authorize('farmer'), upload.array('images', 5), createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, authorize('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;

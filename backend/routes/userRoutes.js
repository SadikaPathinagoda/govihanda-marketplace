const express = require('express');
const { getMe, updateMe, getUserById, getAllUsers, setUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/status', protect, authorize('admin'), setUserStatus);

module.exports = router;

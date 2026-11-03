const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  getAdminItems,
  approveItem,
  rejectItem,
  deleteItemByAdmin,
  getAdminRequests,
  getAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleBlockUser);
router.get('/items', getAdminItems);
router.put('/items/:id/approve', approveItem);
router.put('/items/:id/reject', rejectItem);
router.delete('/items/:id', deleteItemByAdmin);
router.get('/requests', getAdminRequests);
router.get('/analytics', getAnalytics);

module.exports = router;

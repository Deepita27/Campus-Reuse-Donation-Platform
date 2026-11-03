const express = require('express');
const router = express.Router();
const {
  getItems,
  getFeaturedItems,
  getCategoryStats,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyDonations
} = require('../controllers/itemController');
const { protect, optionalProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getItems);
router.get('/featured', getFeaturedItems);
router.get('/categories', getCategoryStats);
router.get('/user/my-donations', protect, getMyDonations);
router.get('/:id', optionalProtect, getItemById);

router.post('/', protect, upload.single('image'), createItem);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;

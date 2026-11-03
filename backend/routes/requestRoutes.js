const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/received', protect, getReceivedRequests);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;

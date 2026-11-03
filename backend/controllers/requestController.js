const Request = require('../models/Request');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// @desc    Submit a new request for an item
// @route   POST /api/requests
// @access  Private (Student)
exports.createRequest = async (req, res) => {
  try {
    const { itemId, message, pickupTime } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required.'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // 1. Prevent students from requesting their own items
    if (item.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own donated item.'
      });
    }

    // 2. Check if item is approved and currently available
    if (item.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'This item is currently awaiting administrator review and cannot be requested.'
      });
    }

    if (item.availability !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This item is currently ${item.availability.toLowerCase()} and cannot accept new requests.`
      });
    }

    // 3. Prevent duplicate active requests by the same student
    const existingActiveRequest = await Request.findOne({
      item: item._id,
      requester: req.user._id,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingActiveRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active request pending or accepted for this item.'
      });
    }

    const newRequest = await Request.create({
      item: item._id,
      requester: req.user._id,
      donor: item.donor,
      message: message || 'Hello, I am interested in this item. Could we coordinate the pickup?',
      pickupTime: pickupTime || ''
    });

    // Notify Donor
    await Notification.create({
      recipient: item.donor,
      sender: req.user._id,
      message: `New Request: ${req.user.name} (${req.user.department}) requested your item "${item.itemName}".`,
      type: 'REQUEST_RECEIVED',
      relatedItem: item._id,
      relatedRequest: newRequest._id,
      link: '/my-donations'
    });

    return res.status(201).json({
      success: true,
      message: 'Item request submitted successfully! The donor has been notified.',
      request: newRequest
    });
  } catch (error) {
    console.error('createRequest error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit item request.'
    });
  }
};

// @desc    Get all items requested by the logged in student
// @route   GET /api/requests/my-requests
// @access  Private
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate('item')
      .populate('donor', 'name email department year phone')
      .sort({ requestedAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('getMyRequests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your requests.'
    });
  }
};

// @desc    Get all requests received by the logged in donor
// @route   GET /api/requests/received
// @access  Private
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ donor: req.user._id })
      .populate('item')
      .populate('requester', 'name email studentId department year phone bio')
      .sort({ requestedAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('getReceivedRequests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve received requests.'
    });
  }
};

// @desc    Update request status (Accept, Reject, Complete, Cancel)
// @route   PUT /api/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, donorNote } = req.body;
    const validStatuses = ['Accepted', 'Rejected', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`
      });
    }

    const request = await Request.findById(req.params.id)
      .populate('item')
      .populate('requester', 'name email')
      .populate('donor', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.'
      });
    }

    const isDonor = request.donor._id.toString() === req.user._id.toString();
    const isRequester = request.requester._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isDonor && !isRequester && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request.'
      });
    }

    const item = await Item.findById(request.item._id);

    // 1. ACCEPT REQUEST (Donor or Admin only)
    if (status === 'Accepted') {
      if (!isDonor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the item donor or administrator can accept this request.'
        });
      }

      if (item.availability !== 'Available') {
        return res.status(400).json({
          success: false,
          message: `Cannot accept request. Item is already ${item.availability.toLowerCase()}.`
        });
      }

      request.status = 'Accepted';
      request.donorNote = donorNote || 'Your request has been accepted! Please meet at pickup location.';
      request.resolvedAt = new Date();
      await request.save();

      // Mark item as Reserved
      item.availability = 'Reserved';
      await item.save();

      // Decline any other pending requests for this item
      await Request.updateMany(
        {
          item: item._id,
          _id: { $ne: request._id },
          status: 'Pending'
        },
        {
          status: 'Rejected',
          donorNote: 'Item was reserved for another student who requested earlier.'
        }
      );

      // Notify the accepted requester
      await Notification.create({
        recipient: request.requester._id,
        sender: req.user._id,
        message: `Good news! Your request for "${item.itemName}" was ACCEPTED by ${request.donor.name}. Pickup: ${item.pickupLocation}.`,
        type: 'REQUEST_ACCEPTED',
        relatedItem: item._id,
        relatedRequest: request._id,
        link: '/my-requests'
      });

      return res.status(200).json({
        success: true,
        message: `Request accepted! Item "${item.itemName}" is now reserved.`,
        request
      });
    }

    // 2. REJECT REQUEST (Donor or Admin only)
    if (status === 'Rejected') {
      if (!isDonor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the item donor can decline this request.'
        });
      }

      request.status = 'Rejected';
      request.donorNote = donorNote || 'Request was declined by donor.';
      request.resolvedAt = new Date();
      await request.save();

      // If the item was reserved for THIS request, set it back to Available
      if (item.availability === 'Reserved') {
        item.availability = 'Available';
        await item.save();
      }

      // Notify Requester
      await Notification.create({
        recipient: request.requester._id,
        sender: req.user._id,
        message: `Your request for "${item.itemName}" was declined by the donor.`,
        type: 'REQUEST_REJECTED',
        relatedItem: item._id,
        relatedRequest: request._id,
        link: '/my-requests'
      });

      return res.status(200).json({
        success: true,
        message: 'Request declined.',
        request
      });
    }

    // 3. COMPLETE REQUEST (Donor, Requester, or Admin)
    if (status === 'Completed') {
      request.status = 'Completed';
      request.resolvedAt = new Date();
      await request.save();

      item.availability = 'Completed';
      await item.save();

      // Notify both parties
      const otherUser = isDonor ? request.requester : request.donor;
      await Notification.create({
        recipient: otherUser._id,
        sender: req.user._id,
        message: `The exchange for "${item.itemName}" has been marked as Completed! Thank you for supporting campus sustainability! ♻️`,
        type: 'REQUEST_COMPLETED',
        relatedItem: item._id,
        relatedRequest: request._id,
        link: '/my-requests'
      });

      return res.status(200).json({
        success: true,
        message: 'Exchange completed successfully! Thank you for sharing.',
        request
      });
    }

    // 4. CANCEL REQUEST (Requester or Admin)
    if (status === 'Cancelled') {
      if (!isRequester && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the requesting student can cancel their request.'
        });
      }

      const wasAccepted = request.status === 'Accepted';
      request.status = 'Cancelled';
      request.resolvedAt = new Date();
      await request.save();

      // If it was accepted and reserved, release the item back to Available
      if (wasAccepted && item.availability === 'Reserved') {
        item.availability = 'Available';
        await item.save();
      }

      // Notify donor
      await Notification.create({
        recipient: request.donor._id,
        sender: req.user._id,
        message: `${request.requester.name} has cancelled their request for "${item.itemName}".`,
        type: 'GENERAL',
        relatedItem: item._id,
        relatedRequest: request._id,
        link: '/my-donations'
      });

      return res.status(200).json({
        success: true,
        message: 'Request cancelled successfully.',
        request
      });
    }
  } catch (error) {
    console.error('updateRequestStatus error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update request status.'
    });
  }
};

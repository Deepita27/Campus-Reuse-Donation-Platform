const Item = require('../models/Item');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all approved items with filters, search & pagination
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      availability,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {
      status: 'Approved' // Public only sees approved items
    };

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All' && condition !== 'all') {
      query.condition = condition;
    }

    // Availability filter (default: Available + Reserved)
    if (availability && availability !== 'All') {
      query.availability = availability;
    } else {
      query.availability = { $in: ['Available', 'Reserved'] };
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { itemName: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { pickupLocation: { $regex: searchRegex } },
        { donorDepartment: { $regex: searchRegex } }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'views') {
      sortOptions = { viewCount: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('donor', 'name email department year')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      items
    });
  } catch (error) {
    console.error('getItems error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve items.'
    });
  }
};

// @desc    Get featured items for Landing Page
// @route   GET /api/items/featured
// @access  Public
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({
      status: 'Approved',
      availability: 'Available'
    })
      .populate('donor', 'name department')
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured items.'
    });
  }
};

// @desc    Get category summary counts
// @route   GET /api/items/categories
// @access  Public
exports.getCategoryStats = async (req, res) => {
  try {
    const categoryCounts = await Item.aggregate([
      { $match: { status: 'Approved', availability: 'Available' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const allCategories = [
      'Books & Study Materials',
      'Electronics',
      'Stationery',
      'Clothing',
      'Lab Equipment',
      'Sports Equipment',
      'Furniture',
      'Others'
    ];

    const result = allCategories.map((cat) => {
      const match = categoryCounts.find((c) => c._id === cat);
      return {
        category: cat,
        count: match ? match.count : 0
      };
    });

    return res.status(200).json({
      success: true,
      categories: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve category statistics.'
    });
  }
};

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public / Optional Auth
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'donor',
      'name email department year phone'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Increment view count
    item.viewCount = (item.viewCount || 0) + 1;
    await item.save();

    // Check if the requesting user has already requested this item
    let hasRequested = false;
    let userRequest = null;
    if (req.user) {
      userRequest = await Request.findOne({
        item: item._id,
        requester: req.user._id,
        status: { $in: ['Pending', 'Accepted'] }
      });
      if (userRequest) {
        hasRequested = true;
      }
    }

    return res.status(200).json({
      success: true,
      item,
      hasRequested,
      userRequest
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve item details.'
    });
  }
};

// @desc    Create a new item donation
// @route   POST /api/items
// @access  Private (Student / Admin)
exports.createItem = async (req, res) => {
  try {
    const { itemName, category, description, condition, pickupLocation, customImageUrl } =
      req.body;

    if (!itemName || !category || !description || !condition || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required item details.'
      });
    }

    // Determine image path: uploaded file OR custom/fallback URL
    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (customImageUrl) {
      image = customImageUrl;
    } else if (req.body.image) {
      image = req.body.image;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload an item image or provide an image link.'
      });
    }

    const newItem = await Item.create({
      itemName,
      category,
      description,
      condition,
      image,
      pickupLocation,
      donor: req.user._id,
      donorName: req.user.name,
      donorDepartment: req.user.department,
      donorEmail: req.user.email,
      status: 'Pending', // Awaiting Admin Approval
      availability: 'Available'
    });

    // Notify donor that item is pending review
    await Notification.create({
      recipient: req.user._id,
      message: `Your item "${newItem.itemName}" has been submitted for review. It will become visible on the campus exchange once approved by administration.`,
      type: 'GENERAL',
      relatedItem: newItem._id,
      link: '/my-donations'
    });

    // Notify administrators of pending approval
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        message: `New item listing pending approval: "${newItem.itemName}" by ${req.user.name} (${req.user.department}).`,
        type: 'GENERAL',
        relatedItem: newItem._id,
        link: '/admin'
      });
    }

    return res.status(201).json({
      success: true,
      message:
        'Donation item submitted successfully! It is now pending administrator review.',
      item: newItem
    });
  } catch (error) {
    console.error('createItem error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit item donation.'
    });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Verify ownership or admin role
    if (item.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing.'
      });
    }

    // Prevent modifying completed items
    if (item.availability === 'Completed' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify an item that has already been marked as Completed.'
      });
    }

    const { itemName, category, description, condition, pickupLocation, customImageUrl } =
      req.body;

    if (itemName) item.itemName = itemName;
    if (category) item.category = category;
    if (description) item.description = description;
    if (condition) item.condition = condition;
    if (pickupLocation) item.pickupLocation = pickupLocation;

    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    } else if (customImageUrl) {
      item.image = customImageUrl;
    }

    // If edited by student, set back to pending review if major fields changed
    if (req.user.role !== 'admin') {
      item.status = 'Pending';
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully! Pending admin re-approval.',
      item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update item.'
    });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Verify ownership or admin role
    if (item.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.'
      });
    }

    // Cancel pending requests for this item
    await Request.updateMany(
      { item: item._id, status: 'Pending' },
      { status: 'Cancelled', donorNote: 'Item listing was deleted by donor.' }
    );

    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Item listing deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete item.'
    });
  }
};

// @desc    Get donations submitted by the logged in student
// @route   GET /api/items/user/my-donations
// @access  Private
exports.getMyDonations = async (req, res) => {
  try {
    const items = await Item.find({ donor: req.user._id }).sort({ createdAt: -1 });

    // For each item, attach request counts (pending, accepted)
    const itemsWithStats = await Promise.all(
      items.map(async (item) => {
        const pendingCount = await Request.countDocuments({
          item: item._id,
          status: 'Pending'
        });
        const acceptedCount = await Request.countDocuments({
          item: item._id,
          status: 'Accepted'
        });
        return {
          ...item.toObject(),
          pendingRequestsCount: pendingCount,
          acceptedRequestsCount: acceptedCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      items: itemsWithStats
    });
  } catch (error) {
    console.error('getMyDonations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your donations.'
    });
  }
};

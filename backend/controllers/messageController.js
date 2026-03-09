const Message = require('../models/Message');
const Property = require('../models/Property');

// @desc    Send a message to property owner
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { propertyId, message, contactPhone, contactEmail } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: property.owner,
      property: propertyId,
      message,
      contactPhone,
      contactEmail,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for logged in user
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    // Both sent and received messages
    const messages = await Message.find({
      $or: [{ receiver: req.user._id }, { sender: req.user._id }]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('property', 'title address city')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};

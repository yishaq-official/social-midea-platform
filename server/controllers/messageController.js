import Message from '../models/Message.js';
import User from '../models/User.js';

// Get contacts (for now, returning all users except self)
export const getContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

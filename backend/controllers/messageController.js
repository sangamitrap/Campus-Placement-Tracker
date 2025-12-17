import Message from '../models/Message.js';
import User from '../models/User.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    // Populate participant details
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const participant = await User.findById(conv._id).select('firstName lastName email department registerNumber');
        return {
          participant,
          lastMessage: conv.lastMessage
        };
      })
    );

    res.json(populatedConversations.filter(conv => conv.participant));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { participantId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: participantId },
        { sender: participantId, recipient: userId }
      ]
    })
    .populate('sender', 'firstName lastName')
    .populate('recipient', 'firstName lastName')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: participantId, recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, relatedJob } = req.body;
    const senderId = req.user._id;

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content,
      relatedJob
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
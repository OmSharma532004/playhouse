const Chat = require('../../models/chat');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    const newMessage = new Chat({ senderId, receiverId, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user._id;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId: currentUser, receiverId: userId },
        { senderId: userId, receiverId: currentUser }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

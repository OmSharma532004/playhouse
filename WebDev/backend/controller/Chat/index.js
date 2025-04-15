const Chat = require('../../models/chat');
const Message = require('../../models/message');

// 1. Send a message (without creating new chat each time)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // If no chat, create one
    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId] });
      await chat.save();
    }

    // Create new message
    const message = new Message({
      chatId: chat._id,
      senderId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// 2. Get messages in a chat
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user._id;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [currentUser, userId] }
    });

    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// 3. Get all chats of a user
exports.getAllChats = async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({ participants: userId }).sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
};

// 4. Initialize a chat manually (optional)
exports.initChat = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (chat) {
      return res.status(200).json({ message: 'Chat already exists', chat });
    }

    chat = new Chat({ participants: [senderId, receiverId] });
    await chat.save();

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to initialize chat' });
  }
};

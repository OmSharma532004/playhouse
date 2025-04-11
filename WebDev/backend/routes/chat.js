const express = require('express');
const router = express.Router();
const chatController = require('../controller/Chat');
const authenticate = require("../authentication");

router.post('/chat/send', authenticate, chatController.sendMessage);
router.get('/chat/:userId', authenticate, chatController.getMessages);

module.exports = router;

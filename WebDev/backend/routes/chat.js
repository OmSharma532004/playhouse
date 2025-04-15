const express = require('express');
const router = express.Router();
const chatController = require('../controller/Chat');
const authenticate = require("../authentication");

router.post('/chat/send', authenticate, chatController.sendMessage);
router.get('/chat/:userId', authenticate, chatController.getMessages);
router.post('/init', authenticate, chatController.initChat);
router.get('/chat', authenticate, chatController.getAllChats);



module.exports = router;

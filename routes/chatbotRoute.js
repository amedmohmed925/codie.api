const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const chatbotController = require('../controllers/chatbotController');

router.post('/chat', isAuth, chatbotController.chatWithBot);

module.exports = router;

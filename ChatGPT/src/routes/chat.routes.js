const express = require("express");
const authMiddleware = require('../middlewares/auth.middleware')
const chatController = require('../controllers/chat.controller')

const router = express.Router();

router.post('/', authMiddleware.authUser, chatController.chatCreate )

module.exports = router;
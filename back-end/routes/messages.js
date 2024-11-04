const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const {
    allMessages,
    sendMessage,
  } = require("../controllers/messageController");
const { requireSignIn, isAuth } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route pour envoyer un message
router.post('/', requireSignIn, isAuth, sendMessage);

// Route pour récupérer les messages
router.get('/:chatId', requireSignIn, isAuth, allMessages);





module.exports = router;

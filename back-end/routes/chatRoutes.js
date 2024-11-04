const express = require("express");
const router = express.Router(); // Initialize the router

const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatController");
const { requireSignIn, isAuth } = require('../middlewares/auth');
const extractToken = require('../middlewares/extractToken'); // Import the middleware

// Apply middleware to all routes
router.use(extractToken);

router.route("/").post(requireSignIn, isAuth, accessChat);
router.route("/").get(requireSignIn, isAuth, fetchChats);
router.route("/group").post(requireSignIn, isAuth, createGroupChat);
router.route("/rename").put(requireSignIn, isAuth, renameGroup);
router.route("/groupremove").put(requireSignIn, isAuth, removeFromGroup);
router.route("/groupadd").put(requireSignIn, isAuth, addToGroup);

module.exports = router;

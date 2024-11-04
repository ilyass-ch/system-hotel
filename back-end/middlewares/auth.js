const expressJwt = require("express-jwt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/user");

exports.requireSignIn = expressJwt({
  secret: 'YOUR_SECRET_KEY',
  algorithms: ['HS256'],  // Ajoutez cette ligne pour spécifier l'algorithme
  userProperty: 'auth',
  getToken: (req) => req.cookies.token
});

exports.isAuth = (req, res, next) => {
  if (!req.auth || !req.auth._id) {
    return res.status(403).json({
      error: "Access denied: user not authenticated",
    });
  }

  const userId = req.auth._id;

  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      console.error("User not found:", err);
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;

    if (!req.profile._id.equals(req.auth._id)) {
      return res.status(403).json({
        error: "Access denied: user mismatch",
      });
    }

    next();
  });
};


exports.isAdmin = (req, res, next) => {
  if (req.auth.role !== "admin") {
    return res.status(403).json({
      error: "Admin resource! Access denied",
    });
  }
  next();
};


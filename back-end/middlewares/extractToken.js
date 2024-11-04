const extractToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      req.token = authHeader.substring(7); // Retire 'Bearer ' du début du token
    } else {
      req.token = null;
    }
    next();
  };
  
  module.exports = extractToken;
  
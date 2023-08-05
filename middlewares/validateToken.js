// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

const blacklistedTokens = [];
//
const validateToken = (req, res, next) => {
  const token = req.headers.token;
  console.log("token: ",token);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  // Check if the token is in the blacklist
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ error: 'Token is blacklisted' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId; 
    next();
  });
};

const blacklistToken = (token) => {
  blacklistedTokens.push(token);
};

module.exports = {
  validateToken,
  blacklistToken,
};

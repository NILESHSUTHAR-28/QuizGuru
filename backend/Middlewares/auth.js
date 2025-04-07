const jwt = require('jsonwebtoken');
const User = require('../Models/Users'); // Ensure the correct path
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log("🔹 Received Headers:", req.headers); // Debugging logs

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
          token = req.headers.authorization.split(' ')[1];
          console.log("🔹 Extracted Token:", token);

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log("🔹 Decoded Token Data:", decoded);

          // Fix: Use `userId` instead of `_id`
          req.user = await User.findById(decoded.userId).select('-Password');
          console.log("✅ Authenticated User:", req.user);

          if (!req.user) {
              return res.status(401).json({ message: 'User not found' });
          }

          next();
      } catch (error) {
          console.error("❌ Token verification failed:", error);
          return res.status(401).json({ message: 'Invalid token' });
      }
  } else {
      return res.status(401).json({ message: 'No token provided' });
  }
});

module.exports = { protect };

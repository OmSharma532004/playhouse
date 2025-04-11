// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const isRetailer = async (req, res, next) => {
  try {
    console.log("Authenticating user");
  
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    //check that user.type === producer
    if (user.type !== 'retailer') {
      return res.status(403).json({ error: 'Access denied' });
    }



    req.user = user; // ✅ Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = isRetailer;

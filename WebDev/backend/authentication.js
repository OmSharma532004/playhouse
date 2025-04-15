// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const authenticate = async (req, res, next) => {
  try {
    console.log("Authenticating user");
  
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // ✅ Attach user to request
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success : false,
      message: 'Authentication failed',

      error: error });
  }
};

module.exports = authenticate;

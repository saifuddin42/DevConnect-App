const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token'); // while sending a request from the client, i'll send a x-auth-token in the header as well which I get in the token variable here

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization Denied.' });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret')); // decode the encrypted token from users.js route

    req.user = decoded.user; // assign the user key from the payload (defined in users.js) to the user in req
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};

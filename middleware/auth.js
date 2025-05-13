const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const signature = crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET)
    .update(`${req.headers['x-timestamp']}${req.originalUrl}`)
    .digest('hex');

  if (signature !== req.headers['x-signature']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  next();
};

module.exports.generateToken = () => {
  return jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' });
};

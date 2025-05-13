const express = require('express');
const router = express.Router();
const { getMarketData, createOrder } = require('../services/binance');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

// Public routes
router.get('/market', rateLimit, async (req, res) => {
  try {
    const data = await getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.post('/order', auth, rateLimit, async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

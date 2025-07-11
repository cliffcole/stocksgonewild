const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Apply auth middleware to all routes
router.use(requireAuth);

router.get('/quote/:symbol', stockController.getQuote);
router.get('/quotes', stockController.getMultipleQuotes);
router.get('/history/:symbol', stockController.getPriceHistory);
router.get('/movers', stockController.getMovers);
router.get('/market-data', stockController.getMarketData);

module.exports = router;
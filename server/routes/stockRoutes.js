const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/quote/:symbol', stockController.getQuote);
router.get('/quotes', stockController.getMultipleQuotes);
router.get('/market-data', stockController.getMarketData);

module.exports = router;
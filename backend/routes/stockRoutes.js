const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getQuote, getHistory } = require('../controllers/stockController');
const router = express.Router();

router.get('/quote/:symbol', requireAuth, getQuote);
router.get('/history/:symbol', requireAuth, getHistory);
router.get('/health', (req, res) =>{
    res.json({ status: 'OK' });
})
// TODO: Add routes for scans/backtesting/reports

module.exports = router;
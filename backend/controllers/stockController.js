const { getStockQuote, getStockHistory } = require('../services/schwabService');

async function getQuote(req, res) {
  try {
    const data = await getStockQuote(req.params.symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
}

async function getHistory(req, res) {
  try {
    const data = await getStockHistory(req.params.symbol, req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

module.exports = { getQuote, getHistory };
const schwabService = require('../services/schwabService');

exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await schwabService.getStockQuote(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMultipleQuotes = async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolList = symbols.split(',');
    const data = await schwabService.getMultipleQuotes(symbolList);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarketData = async (req, res) => {
  try {
    const data = await schwabService.getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
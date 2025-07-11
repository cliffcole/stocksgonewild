const schwabService = require('../services/schwabService');

exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await schwabService.getStockQuote(symbol.toUpperCase(), req.session);
    res.json(data);
  } catch (error) {
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getMultipleQuotes = async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const data = await schwabService.getMultipleQuotes(symbolList, req.session);
    res.json(data);
  } catch (error) {
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await schwabService.getPriceHistory(
      symbol.toUpperCase(), 
      req.session,
      req.query
    );
    res.json(data);
  } catch (error) {
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getMovers = async (req, res) => {
  try {
    const { index = '$DJI', direction = 'up', change = 'percent' } = req.query;
    const data = await schwabService.getMovers(index, direction, change, req.session);
    res.json(data);
  } catch (error) {
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getMarketData = async (req, res) => {
  try {
    // Get market movers and other market data
    const [gainers, losers] = await Promise.all([
      schwabService.getMovers('$DJI', 'up', 'percent', req.session),
      schwabService.getMovers('$DJI', 'down', 'percent', req.session)
    ]);
    
    res.json({ gainers, losers });
  } catch (error) {
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.status(500).json({ error: error.message });
  }
};
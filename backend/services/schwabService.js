const axios = require('axios');
const { getSchwabAccessToken } = require('../utils/schwabToken');

async function getStockQuote(symbol) {
  const accessToken = await getSchwabAccessToken();
  const response = await axios.get(`https://api.schwabapi.com/marketdata/v1/quotes?symbols=${symbol}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
}

async function getStockHistory(symbol, params) {
  const { periodType = 'day', period = 10, frequencyType = 'minute', frequency = 1 } = params;
  const accessToken = await getSchwabAccessToken();
  const response = await axios.get(`https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${symbol}&periodType=${periodType}&period=${period}&frequencyType=${frequencyType}&frequency=${frequency}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  //console.log(response.data);
  return response.data;
}

// TODO: Add methods for scans/backtesting (e.g., calculate MA, RSI on historical data)

module.exports = { getStockQuote, getStockHistory };
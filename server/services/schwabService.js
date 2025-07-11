const axios = require('axios');
const schwabConfig = require('../config/schwab');

class SchwabService {
  constructor() {
    this.baseURL = schwabConfig.apiBaseUrl;
  }

  async makeAuthenticatedRequest(endpoint, options = {}, session) {
    if (!session.tokens) {
      throw new Error('Not authenticated');
    }

    // Check if token needs refresh
    if (Date.now() >= session.tokens.expiresAt - 60000) { // Refresh 1 minute before expiry
      const tokenService = require('./tokenService');
      session.tokens = await tokenService.refreshAccessToken(session.tokens.refresh_token);
    }

    try {
      const response = await axios({
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${session.tokens.access_token}`,
          ...options.headers
        },
        ...options
      });
      
      return response.data;
    } catch (error) {
      console.error('API request error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getStockQuote(symbol, session) {
    return this.makeAuthenticatedRequest(
      `/marketdata/v1/quotes`,
      {
        method: 'GET',
        params: {
          symbols: symbol,
          fields: 'quote,fundamental'
        }
      },
      session
    );
  }

  async getMultipleQuotes(symbols, session) {
    return this.makeAuthenticatedRequest(
      `/marketdata/v1/quotes`,
      {
        method: 'GET',
        params: {
          symbols: symbols.join(','),
          fields: 'quote,fundamental'
        }
      },
      session
    );
  }

  async getPriceHistory(symbol, session, params = {}) {
    const defaultParams = {
      periodType: 'day',
      period: 1,
      frequencyType: 'minute',
      frequency: 5,
      needExtendedHoursData: true
    };

    return this.makeAuthenticatedRequest(
      `/marketdata/v1/pricehistory`,
      {
        method: 'GET',
        params: {
          symbol,
          ...defaultParams,
          ...params
        }
      },
      session
    );
  }

  async getMarketHours(markets, date, session) {
    return this.makeAuthenticatedRequest(
      `/marketdata/v1/markets`,
      {
        method: 'GET',
        params: {
          markets: markets.join(','),
          date
        }
      },
      session
    );
  }

  async getMovers(index, direction, change, session) {
    return this.makeAuthenticatedRequest(
      `/marketdata/v1/movers/${index}`,
      {
        method: 'GET',
        params: {
          direction,
          change
        }
      },
      session
    );
  }
}

module.exports = new SchwabService();
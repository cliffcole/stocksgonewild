const axios = require('axios');
const schwabConfig = require('../config/schwab');

class TokenService {
  async exchangeCodeForTokens(code, codeVerifier) {
    try {
      const response = await axios.post(
        schwabConfig.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: schwabConfig.clientId,
          client_secret: schwabConfig.clientSecret,
          redirect_uri: schwabConfig.redirectUri,
          code_verifier: codeVerifier
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const tokens = response.data;
      tokens.expiresAt = Date.now() + (tokens.expires_in * 1000);
      
      return tokens;
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(
        schwabConfig.tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: schwabConfig.clientId,
          client_secret: schwabConfig.clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const tokens = response.data;
      tokens.expiresAt = Date.now() + (tokens.expires_in * 1000);
      
      return tokens;
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new TokenService();
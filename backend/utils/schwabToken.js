const axios = require('axios');
require('dotenv').config();

async function getSchwabAccessToken() {
  try {
    const response = await axios.post('https://api.schwabapi.com/v1/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: process.env.SCHWAB_REFRESH_TOKEN
    }, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SCHWAB_APP_KEY}:${process.env.SCHWAB_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

module.exports = { getSchwabAccessToken };
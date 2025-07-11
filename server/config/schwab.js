module.exports = {
  clientId: process.env.SCHWAB_CLIENT_ID,
  clientSecret: process.env.SCHWAB_CLIENT_SECRET,
  redirectUri: process.env.SCHWAB_REDIRECT_URI,
  authUrl: 'https://api.schwabapi.com/v1/oauth/authorize',
  tokenUrl: 'https://api.schwabapi.com/v1/oauth/token',
  apiBaseUrl: process.env.SCHWAB_API_BASE_URL,
  scope: 'read api'
};
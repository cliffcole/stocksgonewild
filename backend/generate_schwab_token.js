const axios = require('axios');
const open = require('open');  // npm install open
const readline = require('readline-sync');
require('dotenv').config();

const appKey = process.env.SCHWAB_APP_KEY;
const appSecret = process.env.SCHWAB_APP_SECRET;
const callbackUrl = process.env.SCHWAB_CALLBACK_URL;

const authUrl = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${appKey}&redirect_uri=${callbackUrl}`;
console.log('Open this URL and login with your Schwab brokerage credentials:');
console.log(authUrl);
open(authUrl);

const redirectUrl = readline.question('After login, paste the redirect URL here: ');
const code = new URL(redirectUrl).searchParams.get('code');

const tokenResponse = await axios.post('https://api.schwabapi.com/v1/oauth/token', {
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: callbackUrl
}, {
  headers: {
    Authorization: `Basic ${Buffer.from(`${appKey}:${appSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

console.log('Refresh Token:', tokenResponse.data.refresh_token);
// Add this to .env as SCHWAB_REFRESH_TOKEN
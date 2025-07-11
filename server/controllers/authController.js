const crypto = require('crypto');
const schwabConfig = require('../config/schwab');
const tokenService = require('../services/tokenService');

// Generate PKCE challenge
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  
  return { verifier, challenge };
}

exports.initiateAuth = (req, res) => {
  const { verifier, challenge } = generatePKCE();
  
  // Store verifier in session
  req.session.codeVerifier = verifier;
  
  const authUrl = new URL(schwabConfig.authUrl);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', schwabConfig.clientId);
  authUrl.searchParams.append('redirect_uri', schwabConfig.redirectUri);
  authUrl.searchParams.append('scope', schwabConfig.scope);
  authUrl.searchParams.append('code_challenge', challenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  
  res.json({ authUrl: authUrl.toString() });
};

exports.handleCallback = async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.redirect('http://localhost:5173/auth-error?error=' + error);
  }
  
  if (!code) {
    return res.redirect('http://localhost:5173/auth-error?error=no_code');
  }
  
  try {
    const tokens = await tokenService.exchangeCodeForTokens(
      code,
      req.session.codeVerifier
    );
    
    // Store tokens in session (in production, use a more secure method)
    req.session.tokens = tokens;
    
    // Clear the code verifier
    delete req.session.codeVerifier;
    
    res.redirect('http://localhost:5173/auth-success');
  } catch (error) {
    console.error('Token exchange error:', error);
    res.redirect('http://localhost:5173/auth-error?error=token_exchange_failed');
  }
};

exports.checkAuthStatus = (req, res) => {
  const isAuthenticated = !!req.session.tokens;
  res.json({ 
    isAuthenticated,
    expiresAt: req.session.tokens?.expiresAt || null
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => res.redirect('http://localhost:3000/dashboard'));

// Twitter (X)
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => res.redirect('http://localhost:3000/dashboard'));

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => res.redirect('http://localhost:3000/dashboard'));

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

router.get('/user', (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
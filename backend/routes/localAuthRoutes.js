const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { users } = require('../utils/localUsers');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);
  res.json({ message: 'User registered' });
});

// Login
router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  res.json({ message: 'Logged in', user: req.user });
});

// ... export router
module.exports = router;
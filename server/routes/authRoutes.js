const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.initiateAuth);
router.get('/callback', authController.handleCallback);
router.get('/status', authController.checkAuthStatus);
router.post('/logout', authController.logout);

module.exports = router;
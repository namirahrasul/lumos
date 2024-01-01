const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('*', checkUser);
router.get('/dashboard', requireAuth, userController.dashboard_user_get);
module.exports = router;
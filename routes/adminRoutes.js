const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('*', checkUser);
router.get('/dashboard', requireAuth, adminController.dashboard_admin_get);
router.get('/users', requireAuth, adminController.users_get);

module.exports = router;
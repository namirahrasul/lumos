const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function dashboard_admin_get(req, res) {
 res.render('admin_dashboard', { user: res.locals.user, admin: res.locals.admin });
}

async function users_get(req, res) {
 const users = await User.find({});
 res.render('users', { users, user: res.locals.user, admin: res.locals.admin });
}
module.exports = {
 dashboard_admin_get,
 users_get
}
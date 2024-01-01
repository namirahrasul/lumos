const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


async function dashboard_user_get(req, res) {

 res.render('user_dashboard',{ user:res.locals.user, admin:res.locals.admin});
}

module.exports = {
 dashboard_user_get
}
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const requireAuth = (req, res, next) => {
 const token = req.cookies.jwt;
 if (token) {
  jwt.verify(token, 'tms secret', (err, decodedToken) => {
   if (err) {
    console.log(err.message);
    res.redirect('/login');
   } else {
    // console.log(decodedToken);
    next();
   }
  });
 } else {
  res.redirect('/login');
 }
}

const checkUser = (req, res, next) => {
 const token = req.cookies.jwt;
 if (token) {
  jwt.verify(token, 'tms secret', async (err, decodedToken) => {
   if (err) {
    // console.log(err.message);
    next();
   } else {
    // Check if the user is an admin
    let user = await User.findById(decodedToken.id);
    res.locals.user = user;

    if (user && user.admin) {
     // If the user is an admin, set admin property in locals
     res.locals.admin = true;
    } else {
     // If not an admin, set admin property in locals to false
     res.locals.admin = false;
    }
    next();
   }
  })
 } else {
  res.locals.user = null;
  next();
 }
}
module.exports = { requireAuth, checkUser};
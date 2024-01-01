const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const handleErrors=(err)=>{
 console.log(err.message,err.code);
 let errors = { email: '', password: '' };
 if (err.message === 'incorrect email') {
  errors.email = 'User is not registered. Please sign up';
  return errors;
 }
 if (err.message === 'incorrect password') {
  errors.email = 'Invalid credentials. Please try again';
  errors.password = 'Invalid credentials. Please try again';
  return errors;
 }
 if(err.code === 11000){
  errors.email = 'that email is already registered';
  return errors;
 }

 if(err.message.includes('users validation failed')){
  Object.values(err.errors).forEach(({properties}) => {
   errors[properties.path] = properties.message;
  });
 }
 return errors;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
 return jwt.sign({ id }, 'tms secret', {
  expiresIn: maxAge
 });
}

function signup_get(req, res) {
 res.render('signup',{user:res.locals.user,admin:res.locals.admin});
}
function login_get(req, res) {
 res.render('login',{user:res.locals.user,admin:res.locals.admin});
}
async function signup_post(req, res) {
 console.log("req.body",req.body);
 const {name, email, password } = req.body;
 const admin = false;
 try {
  const user = await User.create({ name, email, password,admin });
  const token = createToken(user._id);
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.redirect('/');

 } catch (err) {
  const errors = handleErrors(err);
  res.status(400).json(errors);
 }

 
}
async function login_post(req, res) {
 const { email, password } = req.body;
 try {
  const user = await User.login(email, password);
  const token = createToken(user._id);
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.redirect('/');

 } catch (err) {
  const errors = handleErrors(err);
  res.status(400).json({errors});
 }


}

async function logout_get(req, res) {
 res.cookie('jwt', '', { maxAge: 1 });
 res.redirect('/');
}

module.exports = {
 signup_get,
 login_get,
 signup_post,
 login_post,
 logout_get
}
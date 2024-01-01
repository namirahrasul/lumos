const { checkUser } = require('../middleware/authMiddleware.js')
const User = require('../models/user.js')
const  handleErrors  = require('../middleware/errorMiddleware.js')


async function newcard_get(req, res) {
    res.render('newcard')
}

async function newcard_post(req, res) {
 try {
  const { deck_name, front_text, back_text, front_img, back_img } = req.body;
  const result = await User.addCard(deck_name, front_text, back_text, front_img, back_img);
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new card:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

async function editcard_get(req, res) {
 try {
  const { deck_name, front_text } = req.params;
  const tags = await User.getTags();
  res.render('editcard', { tags, user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching card data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function editcard_post(req, res) {
 try {
  const { deck_name, front_text, back_text, front_img, back_img,tag } = req.body;
  const result = await User.editCard(deck_name, front_text, back_text, front_img, back_img,tag);
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new card:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

async function deletecard_post(req, res) {
 try {
  const { deck_name, front_text } = req.params;
  const result = await User.deleteCard(deck_name, front_text)
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new card:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

module.exports = {
 newcard_get,
 newcard_post,
 editcard_get,
 editcard_post,
 deletecard_post
}
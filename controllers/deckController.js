const { checkUser } = require('../middleware/authMiddleware.js')
const router = require('express').Router();
const User = require('../models/user.js')
const handleErrors  = require('../middleware/errorMiddleware.js')

 async function alldecks_get(req, res) {
 try {
  const decks = await User.getAllDecks();
  res.render('all-decks', { decks, user: res.locals.user, admin: res.locals.admin  });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function newdeck_get(req, res) {
 try {
  const categories = await User.getCategories();
  
  res.render('create-deck', { categories, user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function newdeck_post(req, res) {
 try {
  const {email, name, description, category } = req.body;
  console.log("req.body", req.body)
  const user = await User.createDeck(email, name, description, category);
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  console.log("error", error)
 }
}

async function editdeck_get(req, res) {
 try {
  const deckString = req.query.deck;
  const deck = JSON.parse(decodeURIComponent(deckString));
  console.log("deck", deck)
  const categories = await User.getCategories();
  res.render('edit-deck', { deck, categories, user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function editdeck_post(req, res) {
 try {
  const { deck_name, description, category } = req.body;
  const email = res.locals.user.email;
  const user = await User.editDeck(email, deck_name, description, category);
  console.log("result", user)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}


async function mydecks_get(req, res) {
 try {
  const decks = await User.getAllDecksofOneUser(res.locals.user.email);
  res.render('my-decks', { decks, user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function categories_get(req, res) {
 try {
  res.render('add-category', { user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function categories_post(req, res) {
 try {
  const { category } = req.body;
  await User.addCategory(category);
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

async function tags_get(req, res) {
 try {
  res.render('add-tag', { user: res.locals.user, admin: res.locals.admin });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function tags_post(req, res) {
 try {
  const { tag } = req.body;
  const result = await User.addTag(tag);
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

async function deletedeck_post(req, res) {
 try {
  const { name } = req.params;
  const result = await User.deleteDeck(res.locals.user.email, name)
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}

async function savedeck_post(req, res) {
 try {
  const { deck_owner, name } = req.params;
  const result = await User.saveDeck(res.locals.user.email, deck_owner, name)
  console.log("result", result)
  res.redirect('/my-decks');
 } catch (error) {
  console.error('Error creating new deck:', error);
  const errors = handleErrors(error);
  res.status(400).json({ errors });
 }
}



const deckModel = require('../models/deckModel.js')
const browseModel = require('../models/deckModel.js')



async function editFlashcardsOfSingleDeck(req, res) {
 const { deckId } = req.params;
 try {
  // Get deck details by deckId using your model function
  const flashcards = await deckModel.getFlashcardsByDeckId(deckId);
  const deck = await deckModel.getDeckInfoByDeckId(deckId);

  // Render the deck prelaunch page with deck data
  res.render('edit-deck', { user: req.session.user, flashcards: flashcards, deck: deck})
 } catch (error) {
  console.error('Error fetching  flashcards:', error);
  res.status(500).send('Internal Server Error');
 }
}
async function reviewFlashcardsOfSingleDeck(req, res) {
 const { deckId } = req.params;
 try {
  // Get deck details by deckId using your model function
  const flashcards = await deckModel.getFlashcardsByDeckId(deckId);
  const deck = await deckModel.getDeckInfoByDeckId(deckId);
  // Render the deck prelaunch page with deck data
  res.render('review-deck', { user: req.session.user, flashcardsJSON: JSON.stringify(flashcards), deck})
 } catch (error) {
  console.error('Error fetching  flashcards:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function timedFlashcardsOfSingleDeck(req, res) {
 const { deckId } = req.params;
 try {
  // Get deck details by deckId using your model function
  const flashcards = await deckModel.getFlashcardsByDeckId(deckId);
  const deck = await deckModel.getDeckInfoByDeckId(deckId);

  // Render the deck prelaunch page with deck data
  res.render('timed-deck', { user: req.session.user, flashcardsJSON: JSON.stringify(flashcards), deck })
 } catch (error) {
  console.error('Error fetching  flashcards:', error);
  res.status(500).send('Internal Server Error');
 }
}




module.exports = {
 alldecks_get,
 newdeck_get,
 mydecks_get,
 categories_get,
 tags_get,
 categories_post,
 tags_post,
 newdeck_post,
 editdeck_get,
 editdeck_post,
 deletedeck_post,
 savedeck_post,





 editFlashcardsOfSingleDeck,
 reviewFlashcardsOfSingleDeck,
 timedFlashcardsOfSingleDeck,

}
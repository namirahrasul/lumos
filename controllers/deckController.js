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

async function getAllSubjects(req, res) {
 try {
  const subjects = await deckModel.getAllSubjects()
  res.render('create-deck', { user: req.session.user, subjectsJSON: JSON.stringify(subjects) });
 } catch (error) {
  console.error('Error fetching deck data:', error);
  res.status(500).send('Internal Server Error');
 }
}


module.exports = {
 editFlashcardsOfSingleDeck,
 reviewFlashcardsOfSingleDeck,
 timedFlashcardsOfSingleDeck,
 getAllSubjects,
}
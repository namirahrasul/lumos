const deckModel = require('../models/deckModel.js')


// Controller function to get a specific record by id


async function getAllUserDecks(req, res) {
 try {
  const deckId= req.params.deckId
  const decks = await deckModel.getMultipleDecksId(deckId)
 
  res.render('browse-decks', { user: req.session.user, decks: decks })
 } catch (error) {
  console.error('Error fetching data:', error)
  res.status(500).send('Internal Server Error')
 }
}

async function editFlashcardsOfSingleDeck(req, res) {
 const { deckId } = req.params;
 try {
  // Get deck details by deckId using your model function
  const flashcards = await deckModel.getFlashcardsByDeckId(deckId);

  // Render the deck prelaunch page with deck data
  res.render('edit-deck', { user: req.session.user, flashcards: flashcards})
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

  // Render the deck prelaunch page with deck data
  res.render('review-deck', { user: req.session.user, flashcardsJSON: JSON.stringify(flashcards) })
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

  // Render the deck prelaunch page with deck data
  res.render('timed-deck', { user: req.session.user, flashcardsJSON: JSON.stringify(flashcards) })
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
 getAllUserDecks,
 editFlashcardsOfSingleDeck,
 reviewFlashcardsOfSingleDeck,
 timedFlashcardsOfSingleDeck,
 getAllSubjects,
}
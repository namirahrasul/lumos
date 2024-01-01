const express = require('express')
const User = require('../models/user')

async function alldecks_get(req, res) {
  try {
    const decks = await User.getAllDecksWithAllCards()
    const categories = await User.getCategories()
    const tags = await User.getTags()
    console.log("decks", decks)
    res.render('browse-decks', { decks, categories, tags, user: res.locals.user, admin: res.locals.admin })
  } catch (error) {
    console.error('Error fetching deck data:', error)
    res.status(500).send('Internal Server Error')
  }
}







const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const browseModel = require('../models/browseModel.js')

async function getMultipleDecks(req, res) {
  try {
    const decks = await browseModel.getMultipleDecks()
   
    res.render('browse-decks', { user: req.session.user, decks: decks })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function getAllDecksByUser(req, res) {
  try {
    const userEmail = req.session.user.email
    // console.log("userEmail", userEmail)
    const decks = await browseModel.getAllDecksByEmail(userEmail)

    res.render('my-decks', { user: req.session.user, decks: decks })
  } catch {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function getSingleDeck(req, res) {
  const { deckId } = req.params;
  try {
    // Get deck details by deckId using your model function
    const deck = await browseModel.getDeckById(deckId);

    // Render the deck prelaunch page with deck data
    res.render('view-deck', { user: req.session.user, deck: deck })
  } catch (error) {
    console.error('Error fetching prelaunch deck data:', error);
    res.status(500).send('Internal Server Error');
  }
}



async function sortDecksByHighestRating(req, res){
  try {
        
      
    const decks = await browseModel.orderDecksByRating();
    res.render('browse-decks', {
      user: req.session.user,
      decks: decks,
      // lastSearch: inputData
    })
    // console.log("decks", decks)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}


async function sortDecksByNewest(req, res){
  try {
        
    // const inputData = req.query.data;
    // console.log(inputData)
      
    const decks = await browseModel.orderDecksByCreateDate();
    res.render('browse-decks', {
      user: req.session.user,
      decks: decks,
      // lastSearch: inputData
    })
    // console.log("decks", decks)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = {
  alldecks_get,



  getSingleDeck,
  getMultipleDecks,
  getAllDecksByUser,
  sortDecksByHighestRating,
  sortDecksByNewest,
  // filterByCategory,

}
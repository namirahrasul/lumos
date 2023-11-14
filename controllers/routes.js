const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = require('path')


const authController = require('./authController') // Import the authentication controller

const deckController = require('./deckController')

const browseRoutes = require('./browseRoutes')
const browseController = require('./browseController')
const userModel = require('../models/userModel') // Import userModel functions

const followController = require('./followController')
const followRoutes = require('./followRoutes')

const deckRoutes = require('./deckRoutes')
const cardRoutes = require('./cardRoutes')
router.get('/', (req, res) => {
  res.render('home', { user: req.session.user }) // Assuming you have a "home.ejs" view file
})
router.get('/register', (req, res) => {
  //const passwordStrengthMessage = '' // Retrieve the message from the query parameters
  res.render('register')
})
router.get('/login', (req, res) => {
  const error = req.session.error || ''
  const success = req.session.success || ''
  res.render('login', { error, success }) // Assuming you have a "home.ejs" view file
})

router.get('/verification', async (req, res) => {
  res.render('verification')
})
router.get('/error', async (req, res) => {
  res.render('error-page')
})
router.get('/verify', async (req, res) => {
  const { token } = req.query
  const user = await userModel.verifyUser(token)

  if (user) {
    console.log('verify route user:', user)
    res.redirect('/login')
  } else {
    res.send('Invalid or expired token.')
  }
})
router.get('/changepassword', async (req, res) => {
  const { token } = req.query
  // const user = await userModel.changePassword(emailtoken)
  await userModel.deleteToken(token)

  const error = req.session.error || ''


  res.render('forgot-password', { error })
})
router.get('/forgot-password', async (req, res) => {
  const error = req.session.error || ''
  res.render('forgot-password', { error })
})

router.get('/send-token', async (req, res) => {
  const error = req.session.error || ''
  res.render('send-token', { error })
})



// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')))


router.get(
  '/decks/shared',
  browseController.getMultipleDecks
)

router.get('/progresstracker', async (req, res) => {
  res.render('calendar', { user: req.session.user })
})

router.get('/my-decks/:userEmail', browseController.getAllDecksByUser)
router.get('/new-deck', deckController.getAllSubjects);
router.get('/review/:deckId', deckController.reviewFlashcardsOfSingleDeck)
router.get('/edit/:deckId', deckController.editFlashcardsOfSingleDeck)
router.get('/timed/:deckId', deckController.timedFlashcardsOfSingleDeck)
router.get('/test/:deckId', deckController.reviewFlashcardsOfSingleDeck)

// Include authentication routes from authController
router.use('/auth', authController)

router.use('/browse', browseRoutes)

router.use('/deck', deckRoutes)

router.use('/flashcard', cardRoutes)


router.get('/sort/rating', browseController.sortDecksByHighestRating)
router.get('/sort/newest', browseController.sortDecksByNewest)

router.get('/notification', followController.getNotifications)
router.get('/MyCampaigns', followController.getMyCampaignsProfile)
router.get('/FollowedCampaigns', followController.getFollowedCampaignsProfile)
router.get('/DonatedCampaigns', followController.getBackedCampaignsProfile)

// testing
// router.get('/approveCampaign/:campaignId', adminController.approveCampaign)




module.exports = router
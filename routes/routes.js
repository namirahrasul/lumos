const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = require('path')


const authController = require('../controllers/authControllerOld') // Import the authentication controller

const deckController = require('../controllers/deckController')

const browseRoutes = require('./browseRoutes')
const browseController = require('../controllers/browseController')
const userModel = require('../models/userModel') // Import userModel functions

const followController = require('../controllers/followController')
const followRoutes = require('./followRoutes')

const deckRoutes = require('./deckRoutes')
const cardRoutes = require('./cardRoutes')





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

// testing
const httpMsgs = require("http-msgs");
const database = require("../models/calendarModel");


router.get('/my-calendar', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.render('my-calendar', { user: req.session.user });
});




// router.post('/calendar-events', (req, res) => {
//   httpMsgs.sendJSON(req, res, {
//     tasks: req.session.user.allTasks[req.body.date]
//   });
// });

// router.post('/new-planned-event', (req, res) => {

//   database.insertNewTask(
//     req.body.eventName.trim(),
//     req.body.eventDescription.trim(),
//     req.body.eventDate,
//     req.body.eventStartTime,
//     req.body.eventEndTime, (isSuccess) => {

//       database.getAllEvents(req.session.user.userID, (results) => {
//         req.session.user.allTasks = {};
//         for (let i = 0; i < results.length; i++) {
//           date = new Date(results[i].DATE);
//           const options = { year: 'numeric', month: 'long', day: 'numeric' };
//           const formattedDate = date.toLocaleDateString('en-US', options);

//           if (!req.session.user.allTasks[formattedDate])
//             req.session.user.allTasks[formattedDate] = []
//           req.session.user.allTasks[formattedDate].push({ ...results[i] });
//         }
//         //console.log(req.session.user.allTasks);
//         httpMsgs.sendJSON(req, res, {
//           success: isSuccess,
//         });
//       })
//     });
// });

// router.post('/delete-planned-event/:id', (req, res) => {
//   database.deleteTask(req.params.id, (isSuccess) => {
//     if (isSuccess) {
//       database.loadAllTasks(req.session.user.userID, (results) => {
//         req.session.user.allTasks = {};
//         for (let i = 0; i < results.length; i++) {
//           date = new Date(results[i].DATE);
//           const options = { year: 'numeric', month: 'long', day: 'numeric' };
//           const formattedDate = date.toLocaleDateString('en-US', options);

//           if (!req.session.user.allTasks[formattedDate])
//             req.session.user.allTasks[formattedDate] = []
//           req.session.user.allTasks[formattedDate].push({ ...results[i] });
//         }
//         //console.log(req.session.user.allTasks);
//         httpMsgs.sendJSON(req, res, {
//           success: isSuccess,
//         });
//       })
//     } else {
//       httpMsgs.sendJSON(req, res, {
//         success: 0,
//       });
//     }
//   });
// });



module.exports = router
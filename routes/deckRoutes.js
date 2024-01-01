const express = require('express')
const router = express.Router()

const deckController = require('../controllers/deckController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

router.get('*', checkUser)
router.post('/new', requireAuth, deckController.newdeck_post)
router.get('/edit/:deck_name', requireAuth, deckController.editdeck_get)
router.post('/edit/:deck_name', requireAuth, deckController.editdeck_post)
router.post('/delete/:name', requireAuth, deckController.deletedeck_post)
router.post('/save/:name', requireAuth, deckController.savedeck_post)


// router.post('/new', async (req, res) => {
//    try {
//       console.log("inside /deck/new")
//       // Retrieve values from the FormData
//       const { name, description } = req.body;
//       const categories = [];
//       const email = req.session.user.email;
//       console.log(email)
//       console.log("name: ", name)
//       console.log("description: ", description)
//       // Iterate through form fields to collect category values
//       for (const key of Object.keys(req.body)) {
//          if (key.startsWith('nametext')) {
//             categories.push(req.body[key]);
//          }
//       }
      
//       // Insert the deck information into the 'decks' table
//       const [deckResult] = await pool.execute('INSERT INTO decks (email, name, description) VALUES (?, ?, ?)', [email, name, description])
//       const deckId = deckResult.insertId;

//       // Iterate through the categories and add them to the 'subjects' table if they don't already exist
//       for (const category of categories) {
//          const [subject] = await pool.query('SELECT id FROM subjects WHERE name = ?', [category])
//          var subjectId;
//          if (subject.length === 0) {
//             const subjectResult = await pool.execute('INSERT INTO subjects (name) VALUES (?)', [category])
//             subjectId = subjectResult.insertId;
//             console.log(subjectId, deckId)


//          } else {
//             subjectId = subject[0].id;
//             console.log(subjectId, deckId)

//          }
//          await pool.execute('INSERT INTO subjects_decks (subject_id, deck_id) VALUES (?, ?)', [subjectId, deckId])
//          // Establish the relationship in the 'subjects_decks' table

//       }
//       res.status(200).send('Flashcard edited successfully');
//    } catch (error) {
//       console.error('Error creating a new deck:', error);
//       res.status(500).send('Error creating a new deck');
//    }
// });
// router.post('/delete/:deckId', async (req, res) => {
//    try {
//       const { deckId } = req.params;
//       const email = req.session.user.email;
//       console.log(email)
//       console.log("deckId", deckId)
//       // Delete the deck from the 'decks' table
//       await pool.execute('DELETE FROM decks WHERE id = ?', [deckId])
//       // Delete the deck from the 'subjects_decks' table
//       await pool.execute('DELETE FROM subjects_decks WHERE deck_id = ?', [deckId])
//       // Delete the deck from the 'cards' table
//       await pool.execute('DELETE FROM cards WHERE deck_id = ?', [deckId])
//       res.status(200).send('Deck deleted successfully');

//    } catch (error) {
//       console.error('Error creating a new deck:', error);
//       res.status(500).send('Error creating a new deck');
//    }
// });
// router.post('/save/:deckId', async (req, res) => {
//    try {
//       const { deckId } = req.params;
//       const email = req.session.user.email;
//       await deckModel.saveDeck(deck, email)
//       res.status(200).send('Deck saved successfully');
   

//    } catch (error) {
//       console.error('Error saving the deck:', error);
//       res.status(500).send('Error saving the deck');
//    }
// });

module.exports = router
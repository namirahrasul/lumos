const express = require('express')
const router = express.Router()
const path = require('path')
const browseModel = require('../models/browseModel.js')
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
 host: process.env.DB_HOST || 'localhost',
 user: process.env.DB_USER || 'root',
 password: process.env.DB_PASSWORD || 'root',
 database: process.env.DB_NAME || 'todo',
 port: process.env.DB_PORT || 3306,
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0,
})

router.post('/new', async (req, res) => {
 try {
  const { deck_name, deck_description } = req.body;
  const categories = [];
  const email = req.session.user.email;
  console.log(email)
  console.log(deck_name)
  console.log(deck_description)
  // Iterate through form fields to collect category values
  for (const key of Object.keys(req.body)) {
   if (key.startsWith('nametext')) {
    categories.push(req.body[key]);
   }
  }

  // Insert the deck information into the 'decks' table
  const [deckResult] = await pool.execute('INSERT INTO decks (email, name, description) VALUES (?, ?, ?)', [email, deck_name, deck_description])
  const deckId = deckResult.insertId;

  // Iterate through the categories and add them to the 'subjects' table if they don't already exist
  for (const category of categories) {
   const [subject] = await pool.query('SELECT id FROM subjects WHERE name = ?', [category])
   var subjectId;
   if (subject.length === 0) {
    const subjectResult = await pool.execute('INSERT INTO subjects (name) VALUES (?)', [category])
    subjectId = subjectResult.insertId;

   } else {
    subjectId = subject[0].id;
   }
   console.log(subjectId, deckId)
   await pool.execute('INSERT INTO subjects_decks (subject_id, deck_id) VALUES (?, ?)', [subjectId, deckId])
   // Establish the relationship in the 'subjects_decks' table

  }
   const decks = await browseModel.getAllDecksByEmail(email)
  res.redirect('/my-decks/${email}', {
   user: req.session.user,
   decks: decks,
}); // Redirect to a success page or any other appropriate action
 } catch (error) {
  console.error('Error creating a new deck:', error);
  res.status(500).send('Error creating a new deck');
 }
});
router.post('/delete/:deckId', async (req, res) => {
   try {
      const { deckId } = req.params;
      const email= req.session.user.email;
      console.log(email)
      console.log("deckId", deckId)
      // Delete the deck from the 'decks' table
      await pool.execute('DELETE FROM decks WHERE id = ?', [deckId])
      // Delete the deck from the 'subjects_decks' table
      await pool.execute('DELETE FROM subjects_decks WHERE deck_id = ?', [deckId])
      // Delete the deck from the 'cards' table
      await pool.execute('DELETE FROM cards WHERE deck_id = ?', [deckId])
      res.status(200).send('Deck deleted successfully');

   } catch (error) {
      console.error('Error creating a new deck:', error);
      res.status(500).send('Error creating a new deck');
   }
});
 module.exports = router
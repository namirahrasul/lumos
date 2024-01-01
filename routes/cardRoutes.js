const express = require('express')
const router = express.Router()
const path = require('path')
const browseModel = require('../models/browseModel.js')
const mysql = require('mysql2/promise')
const multer = require('multer')
const fs = require('fs')

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

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const originalname = file.originalname
      const filenameWithoutExtension = originalname.replace(/\.[^/.]+$/, '') // Remove file extension
      const fileExtension = originalname.split('.').pop() // Get file extension
      const uniqueFilename = `${filenameWithoutExtension}-${uniqueSuffix}.${fileExtension}`
      cb(null, uniqueFilename)
    },
  }),
})


router.post('/delete/:flashcardId', async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const email = req.session.user.email;
    console.log(email)
    console.log("flashcardId", flashcardId)
    // // Delete the deck from the 'decks' table

    // await pool.execute('DELETE FROM tags_cards WHERE card_id = ?', [flashcardId])

    const [flashcard] = await pool.execute('SELECT * from cards WHERE id = ?', [flashcardId])
    console.log("flashcard", flashcard)
    const deckId = flashcard[0].deck_id
    console.log("deckId", deckId)
    const deckSize = await pool.execute('SELECT COUNT(*) from cards WHERE deck_id = ?', [deckId])
    if (deckSize[0][0]['COUNT(*)'] === 1) {
      await pool.execute('DELETE FROM decks WHERE id = ?', [deckId])
      await pool.execute('DELETE FROM subject_decks WHERE deck_id = ?', [deckId])
    }
    await pool.execute('DELETE FROM cards WHERE id = ?', [flashcardId])


    res.status(200).send('flashcard deleted successfully');

  } catch (error) {
    console.error('Error creating a new deck:', error);
    res.status(500).send('Error creating a new deck');
  }
});
router.post('/edit/:flashcardId', [
  upload.fields([
    { name: 'front_img', maxCount: 1 },
    { name: 'back_img', maxCount: 1 },
  ]),
], async (req, res) => {
  try {
    const { flashcardId } = req.params;
    var{ front, back } = req.body;
    const email = req.session.user.email;

    const [oldFlashcard,fields] = await pool.execute('SELECT * from cards WHERE id = ?', [flashcardId]);
    console.log(oldFlashcard[0]);
    var front_img;
    var back_img;

    if (req.files.front_img !== undefined) {
      front_img = req.files.front_img[0].filename;
    } else {
      front_img = oldFlashcard[0].front_img || null;
    }

    if (req.files.back_img !== undefined) {
      back_img = req.files.back_img[0].filename;
    } else {
      back_img = oldFlashcard[0].back_img || null;
    }

    if (front.length === 0 || front === 'undefined') {
      front = oldFlashcard[0].front || null;
    }

    if (back.length === 0 || back === 'undefined') {
      back = oldFlashcard[0].back || null;
    }

    const params = [front_img, back_img, front, back, flashcardId];
    console.log(params);
    var sql = 'UPDATE cards SET front_img = ?, back_img = ?, front = ?, back = ? WHERE id = ?';

    

    const [flashcard] = await pool.execute(sql, params);

    res.status(200).send('Flashcard edited successfully');
  } catch (error) {
    console.error('Error editing flashcard:', error);
    res.status(500).send('Failed to edit flashcard');
  }
});


router.post('/new', [
  upload.fields([
    { name: 'front_img', maxCount: 1 },
    { name: 'back_img', maxCount: 1 },
  ]),
], async (req, res) => {
  try {
    const { deck_id, front, back } = req.body;
    const categories = [];
    const email = req.session.user.email;
    console.log(email)
    console.log(deck_id)
    console.log(front)
    console.log(back)
    console.log(front_img)
    console.log(back_img)
    
    var front_img;
    var back_img;
    if (req.files.front_img !== undefined) {
      front_img = req.files.front_img[0].filename
    }
    else {
      front_img = undefined
    }
    if (req.files.back_img !== undefined) {
      back_img = req.files.back_img[0].filename
    }
    else {
      back_img = undefined
    }
    // // Iterate through form fields to collect category values
    // for (const key of Object.keys(req.body)) {
    //  if (key.startsWith('nametext')) {
    //   categories.push(req.body[key]);
    //  }
    // }

    // Insert the card information into the cards table
    var params = []
    params.push(deck_id)
    var sql = 'INSERT INTO cards (deck_id';
    if (front !== undefined) {
      sql += ', front'
      params.push(front)
    }
    if (back !== undefined) {
      sql += ', back'
      params.push(back)
    }
    if (front_img !== undefined) {
      sql += ', front_img'
      params.push(front_img)
    }
    if (back_img !== undefined) {
      sql += ', back_img'
      params.push(back_img)
    }
    sql += ') VALUES (?'
    for (var i = 0; i < params.length - 1; i++) {
      sql += ', ?'
    }
    sql += ')'
    console.log(sql)
    console.log(params)
    const [cardResult] = await pool.execute(sql, params)
    const cardId = cardResult.insertId;
    console.log("cardId", cardId)

    // // Iterate through the categories and add them to the 'subjects' table if they don't already exist
    // for (const category of categories) {
    //  const [subject] = await pool.query('SELECT id FROM subjects WHERE name = ?', [category])
    //  var subjectId;
    //  if (subject.length === 0) {
    //   const subjectResult = await pool.execute('INSERT INTO subjects (name) VALUES (?)', [category])
    //   subjectId = subjectResult.insertId;

    //  } else {
    //   subjectId = subject[0].id;
    //  }
    //  console.log(subjectId, deckId)
    //  await pool.execute('INSERT INTO subjects_decks (subject_id, deck_id) VALUES (?, ?)', [subjectId, deckId])
    // Establish the relationship in the 'subjects_decks' table

    // }
    res.status(200).send('flashcard created successfully');

    // Redirect to a success page or any other appropriate action
  } catch (error) {
    console.error('Error creating a new deck:', error);
    res.status(500).send('Error creating a new deck');
  }
});

router.post('/rate/:flashcardId', async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { rating } = req.body;
    const email = req.session.user.email;
    console.log(email)
    console.log(flashcardId)
    console.log(rating)
    

    const [ratingResult,fields] = await pool.execute('UPDATE cards SET rating =? WHERE id=?', [flashcardId])
    console.log(ratingResult[0]);
    return res.status(200).send('Rating updated successfully');
  } catch (error) {
    console.error('Error updating rating:', error);
    return res.status(500).send('Failed to update rating');
  }
})
module.exports = router
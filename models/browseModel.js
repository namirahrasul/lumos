// models/deckModel.js
const mysql = require('mysql2/promise') // Use 'mysql2' with promises

// Configure your MySQL connection
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


async function getDeckById(deckId) {
 try {
  const sql = `SELECT * from cards where deck_id = ?`
  const [rows, fields] = await pool.execute(
   sql,
   [deckId]
  )
  if (rows.length === 1) {
   return rows[0]
  } else {
   throw new Error('deck not found')
  }
 } catch (error) {
  throw error
 }
}

async function getAllDecksByEmail(email) {
 try {
  const sql = `SELECT d.*, IFNULL(c.card_count, 0) AS card_count
FROM decks d
LEFT JOIN (
    SELECT deck_id, COUNT(*) AS card_count
    FROM cards
    GROUP BY deck_id
) c ON d.id = c.deck_id WHERE d.email= ?`
  const [rows, fields] = await pool.execute(sql, [email])
  return rows
 } catch (error){
  throw error
 }
 }


async function getMultipleDecks() {
 try {
  const sql = `SELECT d.*, IFNULL(c.card_count, 0) AS card_count
FROM decks d
LEFT JOIN (
    SELECT deck_id, COUNT(*) AS card_count
    FROM cards
    GROUP BY deck_id
) c ON d.id = c.deck_id`

  const [rows, fields] = await pool.execute(sql) // Replace 'decks' with your table name
  return rows
 } catch (error) {
  throw error
 }
}

async function searchAllDecks(search) {
 try {
  const [rows, fields] = await pool.execute(
   // 'SELECT * FROM decks WHERE title LIKE ?',
   // ['%' + search + '%']
   `SELECT * FROM decks WHERE LOWER(name) LIKE LOWER(?)`,
   ['%' + search.toLowerCase() + '%']
  )
  return rows
 }
 catch (error) {
  throw error
 }
}
async function orderDecksByCreateDate() {
 try {
  const [rows, fields] = await pool.execute(

   `SELECT * FROM decks ORDER BY create_date DESC`
  )
  return rows
 }
 catch (error) {
  throw error
 }
}

async function orderDecksByRating() {
 try {
  const [rows, fields] = await pool.execute(`SELECT * FROM decks ORDER BY rating DESC`
  )
  return rows
 }
 catch (error) {
  throw error
 }
}



async function getMaxRating() {
 try {
  const res = await pool.execute(
   'SELECT MAX(rating) from decks'
  )
  return res
 }
 catch (error) {
  throw error
 }
}





async function filterDecksByCategory(subject, minRating, maxRating, ) {
 try {
  var sql1 = `SELECT * FROM decks WHERE `;
  var sql2 = ` subject = ?`
  var sql3 = ' rating >= ? AND rating <= ?'
  var stmt;
  var params = []
  if (!(subject)) {
   stmt = sql1 + sql3;
   params = [minRating,maxRating]
  }
  else {
   stmt = sql1 + sql2 + sql3;
   params = [subject, minRating, maxRating]
  }
  const [rows, fields] = await pool.execute(
   stmt,
   params
  )
  return rows
 }
 catch (error) {
  throw error
 }
}


module.exports = {
 getDeckById,
 getMultipleDecks,
 getAllDecksByEmail,
 getMaxRating,
 orderDecksByCreateDate,
 orderDecksByRating,
 filterDecksByCategory,
 searchAllDecks,
}

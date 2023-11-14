
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

async function getFlashcardsByDeckId(deckId) {
  try {
    const sql = 'select c.*,d.name as deck_name from cards c,decks d where c.deck_id = ? and c.deck_id = d.id'
    const [rows, fields] = await pool.execute(sql, [deckId])
    return rows
  } catch (error) {
    throw error
  }
}
async function insertFlashcard(todo) {
  try {
    const sql = 'insert into todo_list (name)  values (?)'
    const [rows, fields] = await pool.execute(sql, [todo])
    return rows.affectedRows
  } catch (error) {
    throw error
  }
}
  
async function updateFlashcardById(id,todo) {
  try {
    const sql = 'update todo_list set name = ? where id = ?'
    const [rows, fields] = await pool.execute(sql,[todo, id])
    return rows.affectedRows
  } catch (error) {
    throw error
  }
}

async function deleteFlashcardById(id) {
  try {
    const sql = 'delete from todo_list where id = ?'
    const [rows, fields] = await pool.execute(sql, [id])
    return rows.affectedRows
  } catch (error) {
    throw error
  }
}

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
async function getAllTags() {
  try {
    const sql = `SELECT * from tags`
    const [rows, fields] = await pool.execute(sql)
    return rows
  } catch (error) {
    throw error
  }
}
async function getAllSubjects() {
  try {
    const sql = `SELECT * from subjects`
    const [rows, fields] = await pool.execute(sql)
    return rows
  } catch (error) {
    throw error
  }
}




module.exports = {
  insertFlashcard,
  getFlashcardsByDeckId,
  updateFlashcardById,
  deleteFlashcardById,
  getDeckById,
  getAllTags,
  getAllSubjects,
}

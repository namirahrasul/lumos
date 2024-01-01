// models/calendar.js
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

async function getAllEventsByEmail(email) {
 try {
  const sql = `SELECT * FROM events where user = ?`
  const [rows, fields] = await pool.execute(sql, [email])
  return rows
 } catch (error) {
  throw error
 }
}

async function getSingleEventById(id) {
 try {
  const sql = `SELECT events.title, start, end, color, user,type FROM events INNER JOIN decks on decks.id=events.deck_id WHERE id = ?`
  const [rows, fields] = await pool.execute(sql, [id])
  return rows[0]
 } catch (error) {
  throw error
 }
}

async function createEventByUser(title, start, end, color, user, type) {
 try {
  const getDeckId = `SELECT id FROM decks WHERE name = ?`
  const [rows, fields] = await pool.execute(getDeckId, [title])
  const sql = `INSERT INTO events (title, start_time, end_time, color ,user, type) VALUES (?, ?, ?, ?, ?, ?)`
  const [rows2, fields2] = await pool.execute(sql, [
   rows[0].id,
   start,
   end,
   color,
   user,
   type
  ])
  return rows
 } catch (error) {
  throw error
 }
}


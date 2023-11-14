const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid')

const mysql = require('mysql2')

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

async function storeVerificationToken(email, token) {
  try {
    const expirationTimestamp = calculateExpirationTimestamp()
    const sql =
      'INSERT INTO verification_tokens (email, token, expiration_timestamp) VALUES (?, ?, ?)'
    return new Promise((resolve, reject) => {
      pool.query(sql, [email, token, expirationTimestamp], (err, result) => {
        if (err) {
          console.error('Error inserting token: ', err)
          reject(err)
        }
        resolve(result)
      })
    })
  } catch (error) {
    throw error
  }
}
function calculateExpirationTimestamp() {
  const now = new Date()
  const expiration = new Date(now)
  expiration.setHours(now.getHours() + 24) // Token expires in 24 hours
  return expiration
}

async function verifyUser(token) {
  const sql =
    'SELECT * FROM verification_tokens WHERE token = ? AND expiration_timestamp > NOW()'

  return new Promise((resolve, reject) => {
    pool.query(sql, [token], (err, rows) => {
      if (err) {
        console.error('Error verifying user: ', err)
        reject(err)
      } else if (rows.length > 0) {
        const user = rows[0]

        markEmailAsVerified(user.email)
          .then(() => deleteToken(token))
          .then(() => resolve(user))
          .catch((error) => reject(error))
      } else {
        resolve(null)
      }
    })
  })
}

function markEmailAsVerified(email) {
  const sql = 'UPDATE users SET email_verified = 1 WHERE email = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [email], (error, result) => {
      if (error) {
        console.error('Error marking email as verified:', error)
        reject(error)
      } else {
        console.log('Email marked as verified:', result)
        resolve(result)
      }
    })
  })
}

function deleteToken(token) {
  const sql = 'DELETE FROM verification_tokens WHERE token = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [token], (error, result) => {
      if (error) {
        console.error('Error deleting token:', error)
        reject(error)
      } else {
        console.log('Token deleted:', result)
        resolve(result)
      }
    })
  })
}
// Function to create a new user
async function createUser(username, email, password) {
  try {
    // Hash and salt the password using bcrypt
    hashedPassword = await bcrypt.hash(password, 10) // 10 is the number of salt rounds
    const sql =
      'INSERT INTO users (name, email, password,email_verified) VALUES (?, ?, ?,?)'
    return new Promise((resolve, reject) => {
      pool.query(sql, [username, email, hashedPassword, 0], (err, result) => {
        if (err) {
          console.error('Error creating user: ', err)
          reject(err)
        }
        resolve(result)
      })
    })
  } catch (error) {
    throw error
  }
}

// Function to authenticate a user
async function authenticateUser(email, password) {
  const sql = 'SELECT * FROM users WHERE email = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [email], async (err, rows) => {
      if (err) {
        console.error('Error authenticating user: ', err)
        reject(err)
        return
      }

      if (rows.length === 0) {
        // If user not found, return null
        resolve(null)
      } else {
        const user = rows[0] // Assuming there's only one matching user
        const passwordMatch = await comparePasswords(password, user.password)

        if (passwordMatch) {
          // If password matches, return the user
          resolve(user)
        } else {
          // If password doesn't match, return null
          resolve(null)
        }
      }
    })
  })
}



async function comparePasswords(inputPassword, hashedPassword) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword)
  } catch (error) {
    throw error
  }
}
async function changePassword(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const sql = `
    UPDATE users
    SET password = ?
    WHERE email = ?
  `

  return new Promise((resolve, reject) => {
    pool.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Error changing password: ', err)
        reject(err)
      } else resolve(result)
    })
  })
}

module.exports = {
  storeVerificationToken,
  calculateExpirationTimestamp,
  verifyUser,
  markEmailAsVerified,
  deleteToken,
  createUser,
  authenticateUser,
  changePassword,
}

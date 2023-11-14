const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2')

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

// Create a session store using mysql2
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes (adjust as needed)
    expiration: 86400000, // 1 day (adjust as needed)
  },
  pool
);



module.exports = sessionStore

const express = require('express')
const session = require('express-session')
const path = require('path')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const cors = require('cors')
const sessionStore = require('./models/sessionStore') // Import the sessionStore setup
const mainRoutes = require('./controllers/routes') // Import your routes
const app = express()


dotenv.config()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors()) // Enable CORS

// Set up sessions
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore, // Set the session store
  })
)


// Set up routes
app.use('/', mainRoutes)

app.listen(3015, () => {
  console.log(`Server is running on port 3015`)
})

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userModel = require('../models/userModel') // Import userModel functions
const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const { v4: uuidv4 } = require('uuid')

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail'
  auth: {
    user: 'teamiutx@gmail.com', // Your email address
    pass: 'jdmwmburpkocimhh', // Your password
  },
})

// POST request to handle user registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)
  try {
    // Use userModel function to create a new user with the  password
    await userModel.createUser(name, email, password)
    console.log(req.body)
    // Generate a unique verification token
    const verificationToken = uuidv4()

    // Calculate the token's expiration timestamp (e.g., 24 hours from now)
    // const expirationTimestamp = new Date()
    // expirationTimestamp.setHours(expirationTimestamp.getHours() + 24)

    // Store the token in the database
    await userModel.storeVerificationToken(email, verificationToken)

    // Send an email with the verification link (using nodemailer)
    await sendVerificationEmail(email, name, verificationToken)

    // Redirect to a verification page or display a message
    res.redirect('/verification')
  } catch (error) {
    res.status(500).render('error-page', { error })
  }
})

// Function to send a verification email
async function sendVerificationEmail(email, name, verificationToken) {
  try {
    const verificationLink = `http://localhost:3015/verify?token=${verificationToken}`
    const mailOptions = {
      from: process.env.GMAIL_USER || ' ', // Change to your verified sender email
      to: email,
      subject: 'Email Verification',
      html: `<p>Hello ${name}, Thank you for registering!</p>
             <p>Click the following link to verify your email:</p>
             <p><a href="${verificationLink}">${verificationLink}</a>.
             It will expire after 24 hours.</p><p>Regards,</p><p>Lumos</p>`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

// POST request to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log('post route:', req.body)
  try {
    const user = await userModel.authenticateUser(email, password) // Use userModel function
    console.log('result of authenticatuser:', user)
    if (user) {
      // Handle successful login, e.g., create a session
      // res.redirect('/dashboard')
      req.session.user = user
      res.redirect('/') // Redirect to dashboard after successful login
    } else {
      // Handle invalid credentials
      res.render('login', { error: 'Invalid credentials', success: '' }) // Show error message on login page
    }
  } catch (error) {
    res.status(500).render('error-page', { error }) // Render error view on failure
  }
})
//route for logout
router.post('/logout', (req, res) => {
  // Clear the user session
  req.session.user = null
  res.redirect('/')
})

router.post('/send-token', async (req, res) => {
  const { email } = req.body
  // console.log(req.body)
  try {
    // Generate a unique verification token
    const verificationToken = uuidv4()
    console.log(verificationToken)
    await userModel.storeVerificationToken(email, verificationToken)

    // Send an email with the verification link (using nodemailer)
    await sendPasswordVerification(email, verificationToken)

    res.redirect('/verification')
  } catch (error) {
    res.status(500).render('error-page', { error: 'Email could not be sent' })
  }
})
router.post('/forgot-password', async (req, res) => {
  const { email, password } = req.body
  // console.log(req.body)
  try {
    // Send an email with the verification link (using nodemailer)
    const user = await userModel.changePassword(email, password)
    if (user)
      // Redirect to a verification page or display a message
      res.render('login', {
        error: '',
        success: 'Password changed successfully',
      })
    else {
      res.render('forgot-password', {
        error: 'Password change failed',
        success: '',
      })
    }
  } catch (error) {
    res.status(500).render('error-page', { error })
  }
})
// Function to send a change password mail
async function sendPasswordVerification(email, verificationToken) {
  try {
    const verificationLink = `http://localhost:3015/changepassword?token=${verificationToken}`
    const mailOptions = {
      from: process.env.GMAIL_USER, // Change to your verified sender email
      to: email,
      subject: 'Change password',
      html: `<p>Hello , we have received a request to change password</p>
             <p>Click the following link to changed your password:</p>
             <p><a href="${verificationLink}">${verificationLink}</a>.
             It will expire after 24 hours.</p>`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

module.exports = router

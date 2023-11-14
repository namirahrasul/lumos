const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const authController = require('./authController')
const express = require('express')
const router = express.Router()

// POST request to handle user registration
router.post('/register', async (req, res) => {
 const { name, email, password } = req.body
 console.log(req.body)
 try {
  // Use userModel function to create a new user with the  password
  await adminModel.createAdmin(name, email, password)
  console.log(req.body)
  // Generate a unique verification token
  const verificationToken = uuidv4()

  // Calculate the token's expiration timestamp (e.g., 24 hours from now)
  // const expirationTimestamp = new Date()
  // expirationTimestamp.setHours(expirationTimestamp.getHours() + 24)

  // Store the token in the database
  await userModel.storeVerificationToken(email, verificationToken)

  // Send an email with the verification link (using nodemailer)
  await authController.sendVerificationEmail(email, name, verificationToken)

  // Redirect to a verification page or display a message
  res.redirect('/verification')
 } catch (error) {
  res.status(500).render('error-page', { error })
 }
})
router.post('/deleteUser/:userEmail', async (req, res) => {
 const email = req.params.email;
 console.log(email)
 try {
  await adminModel.deleteUser(email);
  res.redirect('/users');

 } catch (error) {
  console.error('Error deleting user:', error);
  res.status(500).send('Internal Server Error');
 }
})

router.post('/declineCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineCampaign(id);
  console.log(affectedRows);
  res.redirect('/UnapprovedCampaigns');

 } catch (error) {
  console.error('Error declining campaign:', error);
  res.status(500).send('Internal Server Error');
 }
})

router.post('/approveCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveCampaign(id);
  console.log(affectedRows);
  
  res.redirect('/UnapprovedCampaigns');


 } catch (error) {
  console.error('Error declining campaign:', error);
  res.status(500).send('Internal Server Error');
 }
})

module.exports=router
const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const followModel = require('../models/followModel')

async function getNotifications (req, res){
    const notif = req.session.user.email;
    console.log(notif);
    try {
      // Get notification details by email using your model function
      const notification = await followModel.getNotifById(notif);
      console.log(notification);
              if (notification === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('notification', { user: req.session.user, notification: null });
        } else {
            res.render('notification', { user: req.session.user, notification });
        }
    } catch (error) {
      console.error('Error fetching notification data:', error);
      res.status(500).send('Internal Server Error');
    }
}
  
async function getMyCampaignsProfile(req, res) {
    const myCamp = req.session.user.email;
    console.log(myCamp);
    try {
      // Get notification details by email using your model function
      const campaigns = await followModel.getMyCampaign(myCamp);
      console.log(campaigns);
      if (campaigns === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('MyCampaigns', { user: req.session.user, campaigns:null});
        } else {
            res.render('MyCampaigns', { user: req.session.user, campaigns:campaigns });
        }
     
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      res.status(500).send('Internal Server Error');
    }
}
  
async function getFollowedCampaignsProfile(req, res){
  const myFollow = req.session.user.email;
  console.log(myFollow);
  try {
    // Get follow details by email using your model function
    const campaigns = await followModel.getMyFollow(myFollow);
    console.log(campaigns);
          if (campaigns === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('FollowedCampaigns', { user: req.session.user, campaigns: null});
        } else {
            res.render('FollowedCampaigns', { user: req.session.user, campaigns: campaigns });
        }
    
  } catch (error) {
    console.error('Error fetching followed campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getBackedCampaignsProfile(req, res) {
  res.render('DonatedCampaigns', { user: req.session.user });
}
module.exports = {
  getNotifications,
  getMyCampaignsProfile,
  getFollowedCampaignsProfile,
  getBackedCampaignsProfile,
  
  }
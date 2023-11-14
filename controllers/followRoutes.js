const express = require('express')
const router = express.Router()
const followModel = require('../models/followModel') // Import the follow model


router.post('/submit', async (req, res) => {
  const data = req.body;
  console.log("data");
  console.log(data); // req.body

  if (!data) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  console.log("email");
  console.log(req.session.user.email);
  console.log("req.body.test");
   console.log(req.body.test);
  const follower = req.session.user.email;
  const cid = req.body.test;

  //  const { follower, cid } = req.body
  if (!follower || !cid) {
    console.error('Invalid follower or following value');
    // Handle the error or return an error response
  } else {
    const result = await followModel.insertFollowData(follower, cid)
    const result2 =await followModel.updateCampaignFollowersById(cid)
    console.log("result");
    console.log(result)
    console.log("result2", result2);

}});


module.exports = router
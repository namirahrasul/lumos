const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const projectModel = require('../models/projectModel')

router.post('/search', async (req, res) => {
    try {
        // console.log(req.body)
        const { search } = req.body
        const campaigns = await projectModel.searchCampaign(search);
        // console.log(campaigns)
        res.render('browse-campaigns', {
            user: req.session.user,
            campaigns: campaigns,
            // lastSearch: search
        })
    } catch (error) {
      console.error('Error fetching data:', error)
     res.status(500).send('Internal Server Error')
    }
}
)

module.exports = router
const express = require('express');
const httpMsgs = require("http-msgs");
const database = require("../server/database");
// Include Express.js
const router = express.Router(); // Create an Express.js router 

router.get('/my-calendar', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    res.render('my-calendar');
});


router.post('/calendar-events', (req, res) => {
    httpMsgs.sendJSON(req, res, {
        tasks: req.session.user.allTasks[req.body.date]
    });
});

router.post('/new-planned-event', (req, res) => {

    database.insertNewTask(
        req.body.eventName.trim(),
        req.body.eventDescription.trim(),
        req.body.eventDate,
        req.body.eventStartTime,
        req.body.eventEndTime, (isSuccess) => {

            database.loadAllTasks(req.session.user.userID, (results) => {
                req.session.user.allTasks = {};
                for (let i = 0; i < results.length; i++) {
                    date = new Date(results[i].DATE);
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    if (!req.session.user.allTasks[formattedDate])
                        req.session.user.allTasks[formattedDate] = []
                    req.session.user.allTasks[formattedDate].push({...results[i]});
                }
                //console.log(req.session.user.allTasks);
                httpMsgs.sendJSON(req, res, {
                    success: isSuccess,
                });
            })
        });
});

router.post('/delete-planned-event/:id', (req, res) => {
    database.deleteTask(req.params.id, (isSuccess) => {
        if (isSuccess) {
            database.loadAllTasks(req.session.user.userID, (results) => {
                req.session.user.allTasks = {};
                for (let i = 0; i < results.length; i++) {
                    date = new Date(results[i].DATE);
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    if (!req.session.user.allTasks[formattedDate])
                        req.session.user.allTasks[formattedDate] = []
                    req.session.user.allTasks[formattedDate].push({...results[i]});
                }
                //console.log(req.session.user.allTasks);
                httpMsgs.sendJSON(req, res, {
                    success: isSuccess,
                });
            })
        } else {
            httpMsgs.sendJSON(req, res, {
                success: 0,
            });
        }
    });
});


//Export the router.
//It will be used in 'router.js'
module.exports = router

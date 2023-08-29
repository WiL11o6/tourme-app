var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../js/database');

router.post('/login', function(req, res, next) {

    const {username, password} = req.body;

    let loggedUserId;
    let loggedUsername;

    db.query('select tourist_id, userName, password from ApprovedTouristUser where userName=?',
    [username])
    .then(function([results, fields]){
        if (results && results.length == 1) {
            loggedUserId = results[0].tourist_id;
            loggedUsername = results[0].userName;
            let dbPassword = results[0].password;
            return bcrypt.compare(password, dbPassword);
        } else {
            throw new Error('Failed Login: Invalid user credentials',
             '/login', 200);
        }
    }).then(function(passwordsMatched) {
        if(passwordsMatched) {
            req.session.userId = loggedUserId;
            req.session.username = loggedUsername;
            req.flash("Success", `Hi ${loggedUsername}, you are now logged in`);
            req.session.save(function(saveErr) {
                res.redirect('/');
            })
        } else {
            throw new Error('Failed Login: Invalid user credentials',
             '/login', 200);
        }
    }).catch(function(err) {
        if(err instanceof Error) {
            req.flash("Error", err.getMessage());
            req.session.save(function(saveErr) {
                res.redirect(err.getRedirectURL());
            })
        } else {
            next(err);
        }
    })
});

module.exports = router;





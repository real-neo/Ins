const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/images/avatars/:user_id', function (req, res) {
    //TODO Query avatar file name of user from db
    const avatarName = 'avatar.png';
    const file = path.resolve('./public/images/avatars/' + avatarName);
    res.sendFile(file);
});

class Story {
    /**
     * @param user_id
     * @param date
     * @param text
     * @param pictures
     * @param location
     * @constructor
     */
    constructor(user_id, date, text, pictures, location) {
        this.user_id = user_id;
        this.date = date;
        this.text = text;
        this.pictures = pictures;
        this.location = location;
    }
}

module.exports = router;

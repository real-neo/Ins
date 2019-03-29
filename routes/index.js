const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
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

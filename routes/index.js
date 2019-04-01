const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

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

router.post('/upload_img', function (req, res) {
    const user_id = req.body.user_id;
    const timeString = new Date().getTime();
    const targetDirectory = './private/images/' + user_id + '/';
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }
    console.log('saving file ' + targetDirectory + timeString);

    // strip off the data: url prefix to get just the base64-encoded bytes
    const image = req.body.image.replace(/^data:image\/\w+;base64,/, "");
    const buf = new Buffer(image, 'base64');
    fs.writeFile(targetDirectory + timeString + '.png', buf);

    const filePath = targetDirectory + timeString;
    console.log('file saved!');

    const data = {user_id: user_id, filePath: filePath};
    // const errX = pictureDB.insertImage(data);
    // if (errX) {
    //     console.log('error in saving data: ' + err);
    //     return res.status(500).send(err);
    // } else {
    //     console.log('image inserted into db');
    // }
    res.end(JSON.stringify({data: ''}));
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

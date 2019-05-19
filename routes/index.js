const router = require('express').Router();
const path = require('path');
const appController = require('../controllers/app');
const authController = require('../controllers/auth');
const crypto = require('crypto');
const fs = require('fs');
// const initDB= require('../controllers/init');
// initDB.init();

router.all('/', appController.indexPage);

router.get('/register', authController.notLoggedIn, authController.getRegister);

router.post('/register', authController.notLoggedIn, authController.postRegister);

router.get('/login', authController.notLoggedIn, authController.getLogin);

router.post('/login', authController.notLoggedIn, authController.postLogin);

router.all('/logout', authController.logout);

router.all('/images/avatars/:user_id', async (req, res) => {
    const hash = crypto.createHash('md5').update(req.params.user_id).digest('hex');
    let file = path.resolve('./public/images/avatars/' + hash);
    if (!fs.existsSync(file)) file = path.resolve('./public/images/default-avatar.png');
    res.sendFile(file);
});

router.get('/map/:lat/:lon', async (req, res) => {
    const lat = req.params.lat || 0;
    const lon = req.params.lon || 0;
    res.locals.lat = lat;
    res.locals.lon = lon;
    res.locals.title = 'Location';
    res.render('map');
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/images/avatars/',
    filename: (req, file, cb) => {
        cb(null, crypto.createHash('md5').update(req.user.local.user_id).digest('hex'))
    }
});

const upload = multer({storage: storage});

router.post('/upload_avatar', authController.isLoggedIn, upload.single('avatar'), (req, res, next) => {
    if (req.file) {
        console.log('Uploading file...');
        console.log(req.file.filename);
        console.log('File Uploaded Successfully');
        res.locals.message = 'File uploaded successfully!';
        res.render('setting');
    } else {
        console.log('No File Uploaded');
        console.log('FILE NOT UPLOADED');
        console.log('File Upload Failed');
        res.locals.message = 'File upload failed!';
        res.render('setting');
    }
    res.end();
});

module.exports = router;
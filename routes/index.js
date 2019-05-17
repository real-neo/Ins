const router = require('express').Router();
const path = require('path');
const appController = require('../controllers/app');
const authController = require('../controllers/auth');
// const initDB= require('../controllers/init');
// initDB.init();

router.all('/', appController.indexPage);

router.get('/register', authController.notLoggedIn, authController.getRegister);

router.post('/register', authController.notLoggedIn, authController.postRegister);

router.get('/login', authController.notLoggedIn, authController.getLogin);

router.post('/login', authController.notLoggedIn, authController.postLogin);

router.all('/logout', authController.logout);

router.all('/images/avatars/:user_id', function (req, res) {
    //TODO MD5 user_id to filename
    const avatarName = 'avatar.png';
    const file = path.resolve('./public/images/avatars/' + avatarName);
    res.sendFile(file);
});

module.exports = router;
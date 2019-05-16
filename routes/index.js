const router = require('express').Router();
const path = require('path');
// const initDB= require('../controllers/init');
// initDB.init();

module.exports = function (passport) {
    /* GET home page. */
    router.all('/', function (req, res, next) {
        res.render('index');
    });

    router.get('/register', function (req, res) {
        res.render('register');
    });

    router.post('/register', function (req, res, next) {
        passport.authenticate('local-reg', function (err, user, info) {
            if (err)
                return next(err);
            if (!user)
                return res.render('register', info);
            req.logIn(user, function (err) {
                if (err)
                    return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    });

    router.get('/login', function (req, res) {
        res.render('login');
    });

    router.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err)
                return next(err);
            if (!user)
                return res.render('login', info);
            req.logIn(user, function (err) {
                if (err)
                    return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    });

    router.all('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.all('/images/avatars/:user_id', function (req, res) {
        //TODO Query avatar file name of user from db
        const avatarName = 'avatar.png';
        const file = path.resolve('./public/images/avatars/' + avatarName);
        res.sendFile(file);
    });

    return router;
};
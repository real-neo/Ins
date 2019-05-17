const passport = require('passport');
require('../middlewares/passport')(passport);

exports.getRegister = async (req, res) => {
    res.locals.title = 'Register';
    res.render('register');
};

exports.postRegister = async (req, res, next) => {
    passport.authenticate('local-reg', function (err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            res.locals.message = info.message;
            res.locals.title = 'Register';
            return res.render('register');
        }
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.getLogin = async (req, res) => {
    res.locals.title = 'Login';
    res.render('login');
};

exports.postLogin = async (req, res, next) => {
    passport.authenticate('local-login', function (err, user, info) {
        if (err)
            return next(err);
        if (!user) {
            res.locals.message = info.message;
            res.locals.title = 'Login';
            return res.render('login');
        }
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = async (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.isLoggedIn = async (req, res, next) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect('/login');
};

exports.notLoggedIn = async (req, res, next) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect('/');
};
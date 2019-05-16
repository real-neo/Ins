const router = require('express').Router();
// const initDB= require('../controllers/init');
// initDB.init();

module.exports = function (passport) {
    /* GET home page. */
    router.get('/', function (req, res, next) {
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

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
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

    return router;
};
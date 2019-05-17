const LocalStrategy = require('passport-local/lib').Strategy;
const User = require('../models/user');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and deserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL REGISTER ==========================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-reg', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            idField: 'user_id',
            nameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            const user_id = req.body.user_id;
            const username = req.body.nickname;
            const passwordAgain = req.body.passwordAgain;

            if (password !== passwordAgain)
                return done(null, false, {message: 'Repeat password does not match.'});

            // asynchronous
            // User.findOne wont fire unless data is sent back
            // process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({'local.email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if there is already a user with that email
                    if (user) {
                        return done(null, false, {message: 'That email is already taken.'});
                    } else {

                        User.findOne({'local.user_id': user_id}, function (err, user) {
                            if (err)
                                return done(err);

                            if (user) {
                                return done(null, false, {message: 'That user ID is already taken.'})
                            } else {
                                // if there is no user with that email or username
                                // create the user
                                const newUser = new User();

                                // set the user's local credentials
                                newUser.local.email = email;
                                newUser.local.user_id = user_id;
                                newUser.local.name = username;
                                newUser.setPassword(password);

                                // save the user
                                newUser.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                });
            // });
        })
    );


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.email': email}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found or invalid password, return the message
                if (!user || !user.validatePassword(password))
                    return done(null, false, {message: 'Invalid email or password.'}); // req.flash is the way to set flash data using connect-flash
                    // return done(null, false);
                // all is well, return successful user
                return done(null, user);
            });

        })
    );

};

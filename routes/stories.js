const router = require('express').Router();
const story = require('../controllers/stories');

module.exports = function(passport) {
    router.get('/', isLoggedIn, story.index);

    router.get('/new', story.new);

    router.post('/new', story.createNew);

    router.post('/get_stories_by_id', story.getStoriesById);

    router.post('/search', story.searchMongo);

    return router;
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
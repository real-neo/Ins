const router = require('express').Router();
const story = require('../controllers/stories');
const isLoggedIn = require('../util/isLoggedIn');

module.exports = function(passport) {
    router.all('/', isLoggedIn, story.index);

    router.all('/new', isLoggedIn, story.new);

    router.all('/create_new', isLoggedIn, story.createNew);

    router.all('/get_stories_by_id', story.getStoriesById);

    router.post('/search', story.searchMongo);

    return router;
};
const router = require('express').Router();
const isLoggedIn = require('../config/isLoggedIn');

module.exports = function(passport) {
    const story = require('../controllers/stories');

    router.all('/', isLoggedIn, story.index);

    router.all('/new', isLoggedIn, story.new);

    router.all('/create_new', isLoggedIn, story.createNew);

    router.all('/get_stories_by_id', story.getStoriesById);

    return router;
};
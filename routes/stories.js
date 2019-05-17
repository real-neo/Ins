const router = require('express').Router();
const storyController = require('../controllers/stories');
const authController = require('../controllers/auth');

router.all('/', authController.isLoggedIn, storyController.index);

router.all('/new', authController.isLoggedIn, storyController.new);

router.post('/create_new', authController.isLoggedIn, storyController.createNew);

router.all('/get_stories_by_id', storyController.getStoriesById);

router.post('/search', storyController.searchMongo);

module.exports = router;
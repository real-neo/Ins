const express = require('express');
const router = express.Router();

const story = require('../controllers/stories');

router.get('/', story.index);

router.get('/new', story.new);

router.post('/new', story.createNew);

router.post('/get_stories_by_id', story.getStoriesById);

module.exports = router;

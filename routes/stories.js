const express = require('express');
const router = express.Router();

const story = require('../controllers/stories');

router.get('/', story.index);

router.get('/new', story.new);

module.exports = router;

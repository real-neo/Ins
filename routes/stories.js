const express = require('express');
const router = express.Router();

const story = require('../controllers/stories');

/* GET users listing. */
router.get('/new', story.new);

module.exports = router;

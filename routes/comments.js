const router = require('express').Router();
const commentController = require('../controllers/comments');
const authController = require('../controllers/auth');

router.post('/create_new', authController.isLoggedIn, commentController.createNew);

router.all('/get_comments_by_event_id', commentController.getCommentsByEventId);

// router.post('/search', commentController.searchMongo);

module.exports = router;
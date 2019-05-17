const router = require('express').Router();
const eventController = require('../controllers/events');
const authController = require('../controllers/auth');

router.all('/', authController.isLoggedIn, eventController.index);

router.get('/:id/show', authController.isLoggedIn, eventController.show);

router.all('/new', authController.isLoggedIn, eventController.new);

router.post('/create_new', authController.isLoggedIn, eventController.createNew);

router.all('/get_all_events', authController.isLoggedIn, eventController.getAllEvents);

// router.post('/search', eventController.searchMongo);

module.exports = router;
const router = require('express').Router();
const userController = require('../controllers/users');
const authController = require('../controllers/auth');

router.all('/get_my_id', authController.isLoggedIn, userController.getMyId);

router.all('/get_name_by_id', userController.getNameById);

router.all('/get_name_by_id/:user_id', userController.getNameById2);

router.get('/setting', authController.isLoggedIn, userController.getSetting);

router.post('/setting', authController.isLoggedIn, userController.postSetting);

module.exports = router;
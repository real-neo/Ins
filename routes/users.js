const router = require('express').Router();
const userController = require('../controllers/users');

router.all('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.all('/get_my_id', userController.getMyId);

router.all('/get_name_by_id', userController.getNameById);

router.all('/get_name_by_id/:user_id', userController.getNameById2);

module.exports = router;
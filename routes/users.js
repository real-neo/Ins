const router = require('express').Router();
const user = require('../controllers/users');

module.exports = function (passport) {
    /* GET users listing. */
    router.all('/', function (req, res, next) {
        res.send('respond with a resource');
    });

    router.all('/get_my_id', function (req, res, next) {
        if (req.isAuthenticated())
            return res.send({logged: true, user_id: req.user.local.user_id, name: req.user.local.name});
        else
            return res.send({logged: false});
    });

    router.all('/get_name_by_id', user.getNameById);

    router.all('/get_name_by_id/:user_id', function (req, res) {
        //TODO Query name of user from db
        console.log('Querying GET get_name_by_id: ' + req.params.user_id);
        res.send('Neo');
    });

    return router;
};
const router = require('express').Router();
const user = require('../controllers/users');

module.exports = function (passport) {
    /* GET users listing. */
    router.get('/', function (req, res, next) {
        res.send('respond with a resource');
    });

    router.post('/get_name_by_id', user.getNameById);

    router.get('/get_name_by_id/:user_id', function (req, res) {
        //TODO Query name of user from db
        console.log('Querying GET get_name_by_id: ' + req.params.user_id);
        res.send('Neo');
    });

    return router;
};
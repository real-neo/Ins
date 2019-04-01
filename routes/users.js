const express = require('express');
const router = express.Router();

const user = require('../controllers/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/get_name_by_id', user.getNameById);

router.get('/get_name_by_id/:user_id', function (req, res) {
    //TODO Query name of user from db
    console.log('Querying: ' + req.params.user_id);
    res.send('Neo');
});

module.exports = router;

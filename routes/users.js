const express = require('express');
const router = express.Router();

const user = require('../controllers/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/get_name_by_id', user.getNameById);

module.exports = router;

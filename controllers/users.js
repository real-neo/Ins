const User = require('../models/user');

exports.getNameById = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    console.log('Querying POST get_name_by_id: ' + userData.user_id);
    userData.name = 'Neo';
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
};

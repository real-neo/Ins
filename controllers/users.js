const User = require('../models/user');

exports.getNameById = async (req, res) => {
    const user_id = req.body.user_id || req.query.user_id;
    if (user_id == null) {
        return res.status(403).send('No data sent!');
    }
    console.log('Querying get_name_by_id: ' + user_id);
    const user = await User.findOne({'local.user_id': user_id});
    if(!user)
        res.status(404).send('Not found');
    else
        res.send({'user_id': user_id, name: user.local.name});
};

exports.getNameById2 = async (req, res) => {
    console.log('Querying get_name_by_id: ' + req.params.user_id);
    const user = await User.findOne({'local.user_id': req.params.user_id});
    if(!user)
        res.status(404).send('Not found');
    else
        res.send(user.local.name);
};

exports.getMyId = async (req, res) => {
    if (req.isAuthenticated())
        return res.send({logged: true, user_id: req.user.local.user_id, name: req.user.local.name});
    else
        return res.send({logged: false});
};
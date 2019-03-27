var Character = require('../models/stories');

exports.new = function (req, res) {
    res.render('stories/new', {title: 'New Story'});
};

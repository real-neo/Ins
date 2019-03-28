var Character = require('../models/stories');

exports.index = function (req, res) {
    res.render('stories/index', {title: 'Stories'});
};

exports.new = function (req, res) {
    res.render('stories/new', {title: 'New Story'});
};

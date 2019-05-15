const mongoose = require('mongoose');
const Story = require('../models/story');
const User = require('../models/user');

exports.init = function () {

    const story = new Story({
        user_id: 'neo',
        date: '1553803899301',
        text: 'Init'
        // pictures:
    });
    story.save();

    const user = new User({
        email:'qwqwqw@11.cc',
        user_id: 'neo',
        name: 'Neo'
    });
    user.save();
};

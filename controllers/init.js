const Story = require('../models/story');
const User = require('../models/user');

exports.init = function () {
    const story = new Story({
        user_id: 'real-neo',
        date: '1553803899301',
        text: 'Init'
        // pictures:
    });
    story.save();

    const user = new User({
        local: {
            email: 'questionyugood@gmail.com',
            user_id: 'real-neo',
            name: 'Neo',
        }
    });
    user.setPassword('123');
    user.save();
};

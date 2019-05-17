const Event = require('../models/event');
const Story = require('../models/story');
const User = require('../models/user');

exports.init = function () {
    const user = new User({
        local: {
            email: 'questionyugood@gmail.com',
            user_id: 'real-neo',
            name: 'Neo',
        }
    });
    user.setPassword('123');

    const event = new Event({
        title: 'initTitle',
        content: 'initContent'
    });

    const story = new Story({
        user: user,
        date: '1553803899301',
        content: 'initContent',
        event: event
        // pictures:
    });
    story.save();

    user.stories.push(story);
    user.save();

    event.stories.push(story);
    event.save();
};

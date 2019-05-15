const Story = require('../models/story');

exports.index = function (req, res) {
    res.render('stories/index');
};

exports.new = function (req, res) {
    res.render('stories/new');
};

exports.getStoriesById = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    console.log('Querying POST get_stories_by_id: ' + userData.user_id);

    let stories = [];

    Story.find({'user_id': userData.user_id}).cursor().eachAsync(mongoStory => {
        console.log(mongoStory);
        let newStory = {
            id: mongoStory._id,
            user_id: mongoStory.user_id,
            date: mongoStory.date,
            text: mongoStory.text,
            pictures: mongoStory.pictures,
            location: {
                latitude: mongoStory.location[0],
                longitude: mongoStory.location[1]
            }
        };
        stories.push(newStory);
    }).then(function () {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(stories));
    });
};

exports.createNew = function (req, res) {
    const newStory = req.body;
    const story = new Story({
        user_id: newStory.user_id,
        date: newStory.date,
        text: newStory.text,
        pictures: newStory.pictures,
        location: [newStory.location.latitude, newStory.location.longitude]
    });
    story.save(function (err, results) {
        console.log('newStory:::::::::::::::::::::::' + newStory);
        console.log('story:::::::::::::::::::::::' + story);
        console.log('db:::::::::::::::::::::::' + results);
    });
    res.send('Nice!');
};
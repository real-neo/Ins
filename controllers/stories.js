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
    let stories = [
        {id: 0, user_id: 'neo', date: 1553803879301, text: 'This is a test blog.'},
        {id: 1, user_id: 'neo', date: 1553803899301, text: 'This is another test blog.'}
    ];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(stories));
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
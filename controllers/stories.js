const Story = require('../models/story');
const Event = require('../models/event');
const User = require('../models/user');

exports.index = async (req, res) => {
    res.locals.title = 'Stories';
    res.render('stories/index');
};

exports.new = async (req, res) => {
    res.locals.title = 'New Story';
    res.locals.events = await Event.find();
    res.render('stories/new');
};

exports.getStoriesById = async (req, res) => {
    const user_id = req.body.user_id || req.query.user_id;
    if (user_id == null) {
        res.status(403).send('No data sent!')
    }
    console.log('Querying get_stories_by_id: ' + user_id);

    const userWithStories = await User.findOne({'local.user_id': user_id}).populate('stories');

    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(userWithStories.stories));
    res.send(JSON.stringify(userWithStories.stories));
};

exports.createNew = async (req, res) => {
    req.body.user = req.user._id;

    const newStory = await new Story(req.body);
    newStory.user_id = req.user.local.user_id;
    newStory.save();

    const user = await User.findOne({_id: req.user._id});
    user.stories.push(newStory);
    user.save();

    const e = await Event.findOne({_id: newStory.event});
    e.stories.push(newStory);
    e.save();
    res.send('Nice!');
};

exports.searchMongo = async (req, res) => {
    const keyword = req.body.keyword;
    console.log(':::::::::::::::::::::::' + keyword.type + keyword);
    let stories = [];
    // Story.find({$text:{$search:keyword},}).exec(function (err, results) {
    //     if (err) return handleError(err);
    //     console.log(':::::::::::::::::::::::' + results.type + results);
    //     stories.push(results);
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify(stories));
    //     // for (let i = 0; i < results.length; ++i) {
    //     //     console.log(results[i]);
    //     //     stories.push(results[i]);
    //     // }
    // });

    Story.find({'text': keyword}).cursor().eachAsync(mongoStory => {
        console.log(mongoStory);
        stories.push(mongoStory);
    }).then(function () {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(stories));
    });


    // then(storys => console.log('cao'+ storys))
    // .cursor.eachAsync(searchStory =>{
    // console.log('search successfully!');
    // if (searchStory.text.toLowerCase().search(keyword.toLowerCase()) > -1)
    // stories.push(searchStory);

    // }
    // Story.textSearch(keyword,function (err, output) {
    //     if (err) return handleError(err);
    //     console.log('bbbbbbbbbbbbbbbbb' + output);
    // }).then(function () {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify(stories));
    // })

};
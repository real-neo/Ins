const Event = require('../models/event');
const User = require('../models/user');
const Comment = require('../models/comment');

// exports.index = async (req, res) => {
//     res.render('comments/index');
// };

// exports.new = async (req, res) => {
//     res.locals.events = await Event.find();
//     res.render('comments/new');
// };

// exports.getStoriesById = async (req, res) => {
//     const user_id = req.body.user_id || req.query.user_id;
//     if (user_id == null) {
//         res.status(403).send('No data sent!')
//     }
//     console.log('Querying get_stories_by_id: ' + user_id);
//
//     let stories = [];
//
//     User.findOne({user_id: user_id}).populate('stories').exec((err, pStories) => {
//         console.log('populated stories:::::' + pStories);
//         stories = pStories;
//     });
//
//     res.setHeader('Content-Type', 'application/json');
//     console.log(JSON.stringify(stories));
//     res.send(JSON.stringify(stories));
// };

exports.createNew = async (req, res) => {
    req.body.user = req.user._id;
    const newComment = await new Comment(req.body);
    newComment.save();
    const user = await User.findOne({_id: req.user._id});
    user.comments.push(newComment);
    user.save();
    const e = await Event.findOne({_id: newComment.event});
    e.comments.push(newComment);
    e.save();
    res.send('Nice!');
};

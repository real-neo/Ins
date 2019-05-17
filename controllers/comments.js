const Event = require('../models/event');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.getCommentsByEventId = async (req, res) => {
    const event_id = req.body.event_id || req.query.event_id;
    if (event_id == null) {
        return res.status(403).send('No data sent!')
    }
    console.log('Querying get_comments_by_event_id: ' + event_id);

    const eventWithComments = await Event.findOne({_id: event_id}).populate('comments');

    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(eventWithComments.comments));
    res.send(JSON.stringify(eventWithComments.comments));
};

exports.createNew = async (req, res) => {
    req.body.user = req.user._id;

    const newComment = await new Comment(req.body);
    newComment.user_id = req.user.local.user_id;
    newComment.save();

    const user = await User.findOne({_id: req.user._id});
    user.comments.push(newComment);
    user.save();

    const e = await Event.findOne({_id: newComment.event});
    e.comments.push(newComment);
    e.save();
    res.send('Nice!');
};

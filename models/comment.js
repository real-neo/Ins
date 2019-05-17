const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// make Schema
const CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    user_id: {type: String, required: true},
    date: {type: Date, default: Date.now},
    content: {type: String, trim: true, required: true},
    pictures: [],
    location: [],
    event: {type: mongoose.Schema.ObjectId, ref: 'Event', required: true}
});

module.exports = mongoose.model('Comment', CommentSchema);

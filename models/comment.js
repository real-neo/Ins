const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// make Schema
const CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    date: {type: Date, default: Date.now},
    content: {type: String, trim: true, required: true},
    event: {type: mongoose.Schema.ObjectId, ref: 'Event', required: true}
});

module.exports = mongoose.model('Comment', CommentSchema);

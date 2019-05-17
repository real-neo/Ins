const mongoose = require('mongoose');

const StorySchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    user_id: {type: String, required: true},
    date: {type: Date, default: Date.now},
    content: {type: String, required: true},
    pictures: [String],
    location: [Number],
    event: {type: mongoose.Schema.ObjectId, ref: 'Event', required: true}
});

StorySchema.index({content: 'text'});

module.exports = mongoose.model('Story', StorySchema);

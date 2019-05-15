const mongoose = require('mongoose');

const StorySchema = mongoose.Schema({
    user_id: {type: String, required: true, max: 100},
    date: {type: Number, required: true},
    text: {type: String, required: true},
    pictures: {type: String},
    location: {type: Array}
});

module.exports = mongoose.model('Story', StorySchema);

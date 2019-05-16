const mongoose = require('mongoose');

const StorySchema = mongoose.Schema({
    user_id: {type: String, required: true, max: 100},
    date: {type: Number, required: true},
    text: {type: String, required: true},
    pictures: {type: String},
    location: {type: Array}
});

// StorySchema.plugin(textSearch);
StorySchema.index({text: 'text'});
// StorySchema.path('text').index({text: true});
// StorySchema.indexes({
//     user_id: 'text',
//     text: 'text',
// });

module.exports = mongoose.model('Story', StorySchema);

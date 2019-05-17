const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// Make Schema
const EventSchema = mongoose.Schema({
    title: {type: String, trim: true, unique: true, require: true},
    content: {type: String, trim: true, required: true},
    date: {type: Date, default: Date.now},
    location: [Number],
    pictures: [String],
    stories: [{
        type: mongoose.Schema.ObjectId, ref: 'Story'
    }],
    comments: [{
        type: mongoose.Schema.ObjectId, ref: 'Comment'
    }]
});
// Define Our Indexes for quick queries and searches
EventSchema.index({
    title: 'text',
    content: 'text'
});

module.exports = mongoose.model('Event', EventSchema);
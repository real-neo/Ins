var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Story = new Schema(
    {
        // first_name: {type: String, required: true, max: 100},
        // family_name: {type: String, required: true, max: 100},
        // dob: {type: Number},
        // whatever: {type: String} //any other field
    }
);

Story.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Story', Story);

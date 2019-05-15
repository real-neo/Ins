const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Story = new Schema({
    user_id: {type: String, required: true, max: 50}
    // first_name: {type: String, required: true, max: 100},
    // family_name: {type: String, required: true, max: 100},
    // dob: {type: Number},
    // whatever: {type: String} //any other field
});

Story.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Story', Story);

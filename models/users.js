const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    user_id: {type: String, required: true, max: 50},
    name: {type: String, required: true, max: 100}
});

User.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Story', Story);

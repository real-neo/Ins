const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
    local: {
        email: {type: String, required: true, unique: true, lowercase: true, trim: true, max: 50},
        user_id: {type: String, required: true, unique: true, max: 50},
        name: {type: String, required: true, trim: true, max: 100},
        salt: {type: String, required: true},
        hash: {type: String, required: true},
    },
    stories: [{
        type: mongoose.Schema.ObjectId, ref: 'Story'
    }],
    comments: [{
        type: mongoose.Schema.ObjectId, ref: 'Comment'
    }]
});

UserSchema.methods.setPassword = function (password) {
    this.local.salt = crypto.randomBytes(16).toString('hex');
    this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
    return this.local.hash === hash;
};

module.exports = mongoose.model('User', UserSchema);

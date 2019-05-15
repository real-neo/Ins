const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {type: String, required: true, max: 50},
    user_id: {type: String, required: true, max: 50},
    name: {type: String, required: true, max: 100},
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('User', UserSchema);

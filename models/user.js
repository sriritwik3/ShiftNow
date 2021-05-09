const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: Number,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
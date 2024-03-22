const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    photo: String,
    role: String
})
const User = mongoose.model('User', userSchema, 'userCollection');
module.exports = User;
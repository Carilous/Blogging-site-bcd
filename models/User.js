const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');
// models/User.js
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png',
    },
    }, { timestamps: true });
// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
}) 
    
userSchema.methods.matchPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String, // Add a salt field for bcrypt
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    history: {
        type: Array,
        default: []
    },
    imageUrl: {
        type: "String",   
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual field for password
userSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Methods for password encryption and authentication
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (error) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema);

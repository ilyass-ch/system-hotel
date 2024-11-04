// models/room.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    photos: {
        type: [String],
        default: []
    }
}, { timestamps: true });

roomSchema.index({ number: 1, hotel: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);

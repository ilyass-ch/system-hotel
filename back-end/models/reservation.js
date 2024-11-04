const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);

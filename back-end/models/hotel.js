const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        default: []
    },
    imageUrl: {
        type: String, // Correction ici
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);

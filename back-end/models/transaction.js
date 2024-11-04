const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

// Créer une transaction et générer une facture automatiquement
const Transaction = require('../models/transaction');
const Reservation = require('../models/reservation');

// Créer une transaction et générer une facture automatiquement
exports.createTransaction = async (req, res) => {
    try {
        const { amount, paymentMethod, reservationId } = req.body;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Vérifier si une transaction existe déjà pour cette réservation
        const existingTransaction = await Transaction.findOne({ reservation: reservationId });
        if (existingTransaction) {
            return res.status(400).json({ error: 'Transaction already exists for this reservation' });
        }

        const transaction = new Transaction({
            amount,
            paymentMethod,
            reservation: reservationId
        });

        const savedTransaction = await transaction.save();

        // Générer la facture automatiquement
        const invoice = {
            transactionId: savedTransaction._id,
            amount: savedTransaction.amount,
            paymentMethod: savedTransaction.paymentMethod,
            transactionDate: savedTransaction.transactionDate,
            reservation: reservation
        };

        // Retourner la transaction et la facture dans la réponse
        res.json({ transaction: savedTransaction, invoice });
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};


// Obtenir toutes les transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('reservation');
        res.json(transactions);
    } catch (err) {
        console.error('Error getting transactions:', err);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
};

// Obtenir une transaction par ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId).populate('reservation');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        console.error('Error getting transaction by ID:', err);
        res.status(500).json({ error: 'Failed to get transaction' });
    }
};

// Mettre à jour une transaction par ID
exports.updateTransactionById = async (req, res) => {
    try {
        const { amount, paymentMethod, reservationId } = req.body;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.transactionId,
            { amount, paymentMethod, reservation: reservationId },
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};

// Supprimer une transaction par ID
exports.deleteTransactionById = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.transactionId);
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

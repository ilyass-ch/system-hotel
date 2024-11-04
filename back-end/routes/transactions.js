const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const path = require('path');
const fs = require('fs');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
// const { userById } = require('../middlewares/user');
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransactionById,
    deleteTransactionById
} = require('../controllers/transactionController');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route pour créer une transaction
// Accessible uniquement par un utilisateur authentifié
router.post('/create/:userId', requireSignIn, isAuth, createTransaction);

// Route pour obtenir toutes les transactions
// Accessible uniquement par un administrateur authentifié
router.get('/', requireSignIn, isAuth, isAdmin, getAllTransactions);

// Route pour obtenir une transaction par son ID
// Accessible uniquement par un administrateur authentifié
router.get('/:transactionId', requireSignIn, isAuth, isAdmin, getTransactionById);

// Route pour mettre à jour une transaction par son ID
// Accessible uniquement par un administrateur authentifié
router.put('/:transactionId/:userId', requireSignIn, isAuth, isAdmin, updateTransactionById);

// Route pour supprimer une transaction par son ID
// Accessible uniquement par un administrateur authentifié
router.delete('/:transactionId/:userId', requireSignIn, isAuth, isAdmin, deleteTransactionById);


module.exports = router;

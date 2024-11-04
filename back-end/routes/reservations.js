const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const { createReservation, getAllReservations, getReservationById, updateReservationById, deleteReservationById, checkRoomAvailability, getReservationsByUser } = require('../controllers/reservationController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route POST pour créer une réservation
router.post('/', requireSignIn, isAuth, checkRoomAvailability, createReservation);

// Route GET pour récupérer toutes les réservations
router.get('/', requireSignIn, isAuth, getAllReservations);

// Route GET pour récupérer une réservation par ID
router.get('/:reservationId', requireSignIn, isAuth, getReservationById);

// Route PUT pour mettre à jour une réservation par ID
router.put('/:reservationId', requireSignIn, isAuth,isAdmin, updateReservationById);

// Route DELETE pour supprimer une réservation par ID
router.delete('/:reservationId', requireSignIn, isAuth,isAdmin, deleteReservationById);

// Route GET pour récupérer toutes les réservations d'un utilisateur spécifique
router.get('/user/:userId', requireSignIn, isAuth, getReservationsByUser);

module.exports = router;

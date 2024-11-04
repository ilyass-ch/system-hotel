// routes/rooms.js

const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const { createRoom, getAllRooms, getRoomById, updateRoomById, deleteRoomById, getRoomsByHotel, checkReservationExists } = require('../controllers/roomController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route POST pour créer une chambre (nécessite une authentification d'administrateur)
router.post('/', requireSignIn, isAuth, isAdmin, createRoom);

// Route GET pour récupérer toutes les chambres
router.get('/', getAllRooms);

// Route GET pour récupérer les chambres par ID d'hôtel
router.get('/hotel/:hotelId', getRoomsByHotel); // Nouvelle route pour obtenir les chambres par hôtel

// Route GET pour récupérer une chambre par ID
router.get('/:roomId', getRoomById);

// Route PUT pour mettre à jour une chambre par ID (nécessite une authentification d'administrateur)
router.put('/:roomId', requireSignIn, isAuth, isAdmin, updateRoomById);

// Route DELETE pour supprimer une chambre par ID (nécessite une authentification d'administrateur)
router.delete('/:roomId', requireSignIn, isAuth, isAdmin, deleteRoomById);

router.post('/check-reservation', requireSignIn, isAuth, checkReservationExists);

module.exports = router;

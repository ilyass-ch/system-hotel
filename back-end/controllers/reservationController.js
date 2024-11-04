const Reservation = require('../models/reservation');
const User = require('../models/user');
const Room = require('../models/room');

// Middleware pour vérifier la disponibilité de la chambre
exports.checkRoomAvailability = async (req, res, next) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;

        // Vérifier si la chambre est réservée dans la plage de dates demandée
        const conflictingReservation = await Reservation.findOne({
            room,
            $or: [
                { checkInDate: { $lte: checkOutDate }, checkOutDate: { $gte: checkInDate } }
            ]
        });

        if (conflictingReservation) {
            return res.status(400).json({ error: 'Room is already reserved for the selected dates' });
        }

        next();
    } catch (err) {
        console.error('Error checking room availability:', err);
        res.status(500).json({ error: 'Failed to check room availability' });
    }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, totalAmount, room } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(req.auth._id); // Utiliser _id au lieu de userId
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        // Vérifier si la chambre existe
        const roomExists = await Room.findById(room);
        if (!roomExists) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const reservation = new Reservation({
            checkInDate,
            checkOutDate,
            totalAmount,
            user: req.auth._id, // Utilisateur authentifié à partir du token JWT
            room
        });

        const savedReservation = await reservation.save();
        res.status(201).json(savedReservation);
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
};


// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
    try {
           
        const { idReservation } = req.query 
        let obj = {};
        if (idReservation){
            obj = { _id : {$in : idReservation} };
        } 

        const reservations = await Reservation.find(obj).populate('user').populate('room');
        res.json(reservations);
    } catch (err) {
        console.error('Error getting reservations:', err);
        res.status(500).json({ error: 'Failed to get reservations' });
    }
};

// Obtenir une réservation par ID
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId).populate('user').populate('room');
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (err) {
        console.error('Error getting reservation by ID:', err);
        res.status(500).json({ error: 'Failed to get reservation' });
    }
};

// Mettre à jour une réservation par ID
exports.updateReservationById = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, totalAmount, room } = req.body;

        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.reservationId,
            { checkInDate, checkOutDate, totalAmount, room },
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.json(updatedReservation);
    } catch (err) {
        console.error('Error updating reservation:', err);
        res.status(500).json({ error: 'Failed to update reservation' });
    }
};

// Supprimer une réservation par ID
exports.deleteReservationById = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.reservationId);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).json({ error: 'Failed to delete reservation' });
    }
};
exports.getReservationsByUser = async (req, res) => {
    try {
        const userId = req.auth._id; // Récupérer l'ID de l'utilisateur authentifié
      
        const { idReservation } = req.query 
        let obj = {};
        if (idReservation){
            obj = { _id : {$in : idReservation} };
        }

        const reservations = await Reservation.find({ user: userId , ...obj }).populate('room').populate('hotel');
        
        if (!reservations.length) {
            return res.status(404).json({ error: 'No reservations found for this user' });
        }

        res.json(reservations);
    } catch (err) {
        console.error('Error getting user reservations:', err);
        res.status(500).json({ error: 'Failed to get reservations for this user' });
    }
};
const moment = require('moment'); 

// controllers/roomController.js

const Room = require('../models/room');

// Créer une nouvelle chambre
exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        if (error.code === 11000) {
            // Erreur de duplication pour les champs uniques
            res.status(400).json({ error: 'Room number already exists for this hotel' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Obtenir toutes les chambres
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('hotel');
        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching rooms', details: error });
    }
};

// Obtenir une chambre par ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId).populate('hotel');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching room', details: error });
    }
};

// Mettre à jour une chambre par ID
exports.updateRoomById = async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(400).json({ error: 'Error updating room', details: error });
    }
};

// Supprimer une chambre par ID
exports.deleteRoomById = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndRemove(req.params.roomId);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting room', details: error });
    }
};
// Fonction pour obtenir les chambres par ID d'hôtel
exports.getRoomsByHotel = async (req, res) => {
    try {
      const { hotelId } = req.params;
      const rooms = await Room.find({ hotel: hotelId });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

exports.checkReservationExists = async (req, res) => {
    try {
      const { roomId, checkInDate, checkOutDate } = req.body;

      console.log('====================================');
      console.log('',req.body);
      console.log('====================================');
  
      if (!roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }
  
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
  
      if (checkIn >= checkOut) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date.' });
      }
  
      // Trouver les réservations qui se chevauchent
      const existingReservations = await Reservation.find({
        room: roomId,
        $or: [
          {
            $and: [
              { checkInDate: { $lt: checkOut } },
              { checkOutDate: { $gt: checkIn } }
            ]
          }
        ]
      });
  
      if (existingReservations.length > 0) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking reservation existence:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
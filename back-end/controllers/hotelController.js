const Hotel = require('../models/hotel');

// Créer un hôtel
exports.createHotel = async (req, res) => {
    const { name, description, location, amenities, imageUrl, city } = req.body;

    try {
        const hotel = new Hotel({
            name,
            description,
            location,
            amenities,
            imageUrl,
            city
        });

        await hotel.save();
        res.status(201).json(hotel);
    } catch (err) {
        console.error('Error creating hotel:', err);
        res.status(500).json({ error: 'Failed to create hotel' });
    }
};

// Lister tous les hôtels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().populate('city', 'name country');
        res.json(hotels);
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
};

// Obtenir un hôtel par ID
exports.getHotelById = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const hotel = await Hotel.findById(hotelId).populate('city', 'name country');
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (err) {
        console.error('Error fetching hotel by ID:', err);
        res.status(500).json({ error: 'Failed to fetch hotel' });
    }
};

// Mettre à jour un hôtel par ID
exports.updateHotelById = async (req, res) => {
    const { hotelId } = req.params;
    const { name, description, location, amenities, imageUrl, city } = req.body;

    console.log('Update request received with data:', {
        hotelId,
        name,
        description,
        location,
        amenities,
        imageUrl,
        city
    });

    try {
        const hotel = await Hotel.findByIdAndUpdate(hotelId, {
            name,
            description,
            location,
            amenities,
            imageUrl,
            city
        }, { new: true });

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.json(hotel);
    } catch (err) {
        console.error('Error updating hotel by ID:', err);
        res.status(500).json({ error: 'Failed to update hotel' });
    }
};


// Supprimer un hôtel par ID
exports.deleteHotelById = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const hotel = await Hotel.findByIdAndDelete(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        console.error('Error deleting hotel by ID:', err);
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
};

// Rechercher des hôtels par ville ou période
exports.searchHotels = async (req, res) => {
    const { cityId, checkInDate, checkOutDate } = req.query;

    try {
        // Rechercher les hôtels en fonction de la ville sélectionnée
        let query = {};
        if (cityId) {
            query.city = cityId;
        }

        // Si une période est fournie, exclure les hôtels dont toutes les chambres sont réservées pour cette période
        if (checkInDate && checkOutDate) {
            const reservations = await Reservation.find({
                checkInDate: { $lte: new Date(checkOutDate) },
                checkOutDate: { $gte: new Date(checkInDate) }
            }).distinct('room');

            const unavailableRooms = await Room.find({ _id: { $in: reservations } }).distinct('hotel');
            query._id = { $nin: unavailableRooms };
        }

        const hotels = await Hotel.find(query).populate('city', 'name country');
        res.json(hotels);
    } catch (err) {
        console.error('Error searching hotels:', err);
        res.status(500).json({ error: 'Failed to search hotels' });
    }
};
exports.getHotelsByCity = async (req, res) => {
    const { cityId } = req.params;

    try {
        const hotels = await Hotel.find({ city: cityId }).exec();
        if (!hotels.length) {
            return res.status(404).json({ message: 'No hotels found in this city' });
        }
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch hotels', message: err.message });
    }
};


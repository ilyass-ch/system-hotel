// routes/hotelRoutes.js

const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const { createHotel, getAllHotels,searchHotels, getHotelById, updateHotelById, deleteHotelById, getHotelsByCity  } = require('../controllers/hotelController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route POST pour créer un hôtel
router.post('/', requireSignIn, isAuth, isAdmin, createHotel);    // valide

// Route GET pour récupérer tous les hôtels
router.get('/', getAllHotels);                           // valide

// Route GET pour récupérer un hôtel par ID
router.get('/:hotelId', getHotelById);                      // valide

// Route PUT pour mettre à jour un hôtel par ID
router.put('/:hotelId', requireSignIn, isAuth, isAdmin, updateHotelById);      // valide

// Route DELETE pour supprimer un hôtel par ID
router.delete('/:hotelId', requireSignIn, isAuth, isAdmin, deleteHotelById);    // valide   

// Route pour rechercher des hôtels
router.get('/search', async (req, res) => {
    const { destination, startDate, endDate, adult, children, room } = req.query;

    try {
        // Validate and process the parameters as needed
        const searchResults = await Hotel.find({
            location: destination,
            // You can add more complex queries here based on your requirements
        });

        res.json(searchResults);
    } catch (error) {
        console.error("Error searching hotels:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route GET pour récupérer tous les hôtels d'une ville spécifique
router.get('/city/:cityId', getHotelsByCity);

module.exports = router;

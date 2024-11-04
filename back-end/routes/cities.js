// routes/cities.js

const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const { createCity, getAllCities, getCityById, updateCityById, deleteCityById } = require('../controllers/cityController');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route POST pour créer une ville (nécessite une authentification d'administrateur)
router.post('/', requireSignIn, isAuth, isAdmin,createCity);                                         // valide 

// Route GET pour récupérer toutes les villes
router.get('/', getAllCities);             // valide

// Route GET pour récupérer une ville par ID
router.get('/:cityId', getCityById);              // valide

// Route PUT pour mettre à jour une ville par ID (nécessite une authentification d'administrateur)
router.put('/:cityId', requireSignIn, isAuth, isAdmin, updateCityById);     // valide

// Route DELETE pour supprimer une ville par ID (nécessite une authentification d'administrateur)
router.delete('/:cityId', requireSignIn, isAuth, isAdmin, deleteCityById);    // valide




// router.param('cityId', getCityById)

module.exports = router;

// controllers/cityController.js

const City = require('../models/city');

// Créer une nouvelle ville
exports.createCity = async (req, res) => {
    const { name, country } = req.body;

    try {
        // Vérifier si la ville existe déjà
        const existingCity = await City.findOne({ name });
        if (existingCity) {
            return res.status(400).json({ error: 'City with this name already exists' });
        }

        // Créer une nouvelle ville
        const city = new City({ name, country });
        await city.save();

        res.status(201).json(city);
    } catch (err) {
        console.error('Error creating city:', err);
        res.status(500).json({ error: 'Failed to create city' });
    }
};

// Récupérer toutes les villes
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find().exec();
        res.json(cities);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cities', message: err.message });
    }
};

// Récupérer une ville par ID
exports.getCityById = async (req, res) => {
    const { cityId } = req.params;

    try {
        const city = await City.findById(cityId).exec();
        if (!city) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.json(city);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch city', message: err.message });
    }
};

// Mettre à jour une ville par ID
exports.updateCityById = async (req, res) => {
    const { cityId } = req.params;
    const { name, country } = req.body;

    try {
        const city = await City.findByIdAndUpdate(cityId, { name, country }, { new: true }).exec();
        if (!city) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.json({ message: 'City updated successfully', city });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update city', message: err.message });
    }
};

// Supprimer une ville par ID
exports.deleteCityById = async (req, res) => {
    const { cityId } = req.params;

    try {
        const city = await City.findByIdAndDelete(cityId).exec();
        if (!city) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.json({ message: 'City deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete city', message: err.message });
    }
};

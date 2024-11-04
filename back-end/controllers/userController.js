const User = require('../models/user'); // Assure-toi que le chemin d'accès au modèle est correct
const { validationResult } = require('express-validator');
// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-hashed_password');
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};


// Récupérer un utilisateur par son ID
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-hashed_password');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'L\'email est déjà pris' });
    }

    user = new User({ name, email, password, role });
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateOneUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log('Request body:', req.body); // Debugging line

  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Update user fields
    user.name = name;
    user.email = email;
    if (password) user.password = password; // Use virtual field to hash the password
    user.role = role;

    await user.save();
    user.hashed_password = undefined; // Do not return hashed password
    console.log('Updated user:', user); // Debugging line
    res.json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Supprimer un utilisateur
exports.deleteOneUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await user.remove();
    user.hashed_password = undefined; // Ne pas renvoyer le mot de passe haché
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

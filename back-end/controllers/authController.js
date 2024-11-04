const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.salam = (req, res) => {
    res.send({ message: 'user module' });
};

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // Hide sensitive information like hashed_password and salt
        user.hashed_password = undefined;
        user.salt = undefined;
        
        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Send the token along with the user data
        res.json({
            message: "Utilisateur créé avec succès",
            user: user,
            token: token
        });
    });
};
exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            });
        }

        // Generate a token and send it to the client
        const token = jwt.sign({ _id: user._id, role: user.role }, 'YOUR_SECRET_KEY');

        // Set cookie with token
        res.cookie('token', token, { expire: new Date() + 9999 , httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'});

  
        // Return response with user and token
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    });
};
// Update user profile
// Exemple de contrôleur de mise à jour de l'utilisateur
exports.updateProfile = async (req, res) => {
    try {
      const { name, email, role, imageUrl , password } = req.body; // Extraction des données du corps de la requête
      const userId = req.params.userId; // Extraction de l'ID de l'utilisateur des paramètres de la requête
  
      // Trouver l'utilisateur par ID et mettre à jour les champs
      const user = await User.findByIdAndUpdate(
        userId,
        { name, email, role, imageUrl , password }, // Inclure le champ 'role' ici
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Échec de la mise à jour du profil' });
    }
  };
  
  

  // Get user profile
exports.getProfile = async (req, res) => {
    try {
      const userId = req.params.userId; 
      // Find user by ID
      const user = await User.findById(userId).select("imageUrl"); // Adjust fields as needed
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  };

exports.signout = (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
};


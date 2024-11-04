const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const { createUser, getAllUsers, getOneUser, updateOneUser, deleteOneUser } = require('../controllers/userController');
const { userSignupValidator, validate } = require('../middlewares/userValidator');
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// const { userById } = require('../middlewares/user');
// const { userById } = require('../middlewares/user');

// console.log('====================================');
// console.log(userById);
// console.log('====================================');
// router.param('userId', userById)

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

// Route POST pour créer un utilisateur
router.post('/', requireSignIn, isAuth,isAdmin, createUser);    //valider

// Route GET pour récupérer tous les utilisateurs (nécessite une authentification d'administrateur)
router.get('/', requireSignIn, isAuth,isAdmin, getAllUsers);  //valide

// Route GET pour récupérer un utilisateur par ID
router.get('/profile/:userId', requireSignIn, isAuth,  getOneUser);  //valide

// Route PUT pour mettre à jour un utilisateur par ID
router.put('/profile/:userId',   requireSignIn, isAuth, updateOneUser);  //valide

// Route DELETE pour supprimer un utilisateur par ID
router.delete('/:userId', requireSignIn, isAuth,isAdmin, deleteOneUser);  // valide  

// router.param('userId', userById)

module.exports = router;

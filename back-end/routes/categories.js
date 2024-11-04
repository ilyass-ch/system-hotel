const express = require('express');

const router = express.Router();
// const { userById } = require('../middlewares/user')
const { 
    createCategory,
    categoryId, 
    showCategory, 
    updateCategory, 
    removeCategory, 
    allCategories 
    
} = require('../controllers/categoryController');

const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth')


// Route pour modifier une category
router.put('/:categoryId/:userId', [requireSignIn, isAuth, isAdmin], updateCategory);

// Route pour supprime une category
router.delete('/:categoryId/:userId', [requireSignIn, isAuth, isAdmin], removeCategory);

// Route pour afficher une catégorie spécifique
router.get('/:categoryId', showCategory);

// Route pour afficher toutes les catégories 
router.get('/', allCategories);

router.param('categoryId', categoryId);

// Route pour creer une catégorie spécifique
router.post('/create/:userId',[requireSignIn, isAuth, isAdmin], createCategory );
// router.param('userId', userById);

module.exports = router;
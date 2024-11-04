const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
// const { userById } = require('../middlewares/user');
const { 
        photoProduct,
        searchProduct,
        createProduct, 
        showProduct, 
        productById, 
        removeProduct, 
        updateProduct,
        allProducts,
        relatedProduct 
    } = require('../controllers/productController');

const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);


// Route pour afficher touts les produits 
router.get('/', allProducts);

// Route pour afficher un produit spécifique
router.get('/:productId', showProduct);

router.post('/search', searchProduct);

router.get('/photo/:productId', photoProduct);


router.get('/related/:productId', relatedProduct);

// Route pour créer un produit
router.post('/create/:userId', [requireSignIn, isAuth, isAdmin], createProduct);

// Route pour supprimer un produit
router.delete('/:productId/:userId', [requireSignIn, isAuth, isAdmin], removeProduct);

// Route pour modifier un produit
router.put('/:productId/:userId', [requireSignIn, isAuth, isAdmin], updateProduct);

// Middleware pour charger l'utilisateur par ID
// router.param('userId', userById);

// Middleware pour charger le produit par ID
router.param('productId', productById);

module.exports = router;


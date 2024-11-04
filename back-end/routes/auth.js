const express = require('express');
const extractToken = require('../middlewares/extractToken');
const { salam, signup, signin, signout ,updateProfile , getProfile} = require('../controllers/authController');
const { userSignupValidator, validate } = require('../middlewares/userValidator');
const { requireSignIn , isAuth } = require('../middlewares/auth');
const multer = require('../middlewares/multer');
const router = express.Router();

// Utiliser extractToken middleware sur toutes les routes
router.use(extractToken);

router.get('/', salam);

router.post('/signup', userSignupValidator, validate, multer, signup);
router.post('/signin', signin);   // valide
router.get('/signout', signout);  // valide
router.put('/updateprofile/:userId', requireSignIn, isAuth,multer, updateProfile);  // valide
router.get('/getprofile/:userId', requireSignIn, isAuth,multer, getProfile);  // valide



router.get('/hello', (req, res) => {
    res.send({ message: 'hello world' });
});



module.exports = router;

const express = require('express');

const { userById } = require('../middlewares/user')

const router = express.Router();
const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { generateToken, processPayment} = require('../controllers/brainttreeController')


router.get('/getToken/:userId', requireSignIn, isAuth, generateToken )
router.post('/purchase/:userId', requireSignIn, isAuth, processPayment);  // POST route for the payment

router.param('userId', userById);
module.exports = router

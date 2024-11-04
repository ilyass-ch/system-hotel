const express = require('express');
const router = express.Router();
const extractToken = require('../middlewares/extractToken');
const {isAuth  , requireSignIn} = require('../middlewares/auth');
const multer = require('../middlewares/multer');
const { createThing , getThingById , updateThing , deleteThing , getAllThings} = require('../controllers/imageController');


router.use(extractToken);

router.post('/upload', requireSignIn , isAuth , multer, createThing);
router.get('/:id', requireSignIn , isAuth , multer, getThingById);
router.put('/:id' , requireSignIn ,  isAuth , multer, updateThing);
router.delete('/:id', requireSignIn , isAuth , multer,  deleteThing);
router.get('/', requireSignIn , isAuth , multer,  getAllThings);

module.exports = router;

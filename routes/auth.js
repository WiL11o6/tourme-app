const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/design', authController.design)
router.post('/addlocation', authController.addlocation)


module.exports = router;
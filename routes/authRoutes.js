const express = require('express');
const { register, login } = require('../controllers/authController'); // Changed to match the exported names
const { addOrUpdateUserHandles } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


module.exports = router;

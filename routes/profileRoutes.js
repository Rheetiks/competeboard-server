const express = require('express');
const { addOrUpdateUserHandles, getProfilesData } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/userhandles', authMiddleware, addOrUpdateUserHandles);

router.get('/profiles-data', authMiddleware, getProfilesData); 

module.exports = router;

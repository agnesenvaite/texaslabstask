const express = require('express');
const { saveGameData, listSavedGameDataUserID} = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);
router.get('/save', listSavedGameDataUserID);

module.exports = router;

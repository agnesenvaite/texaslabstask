const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body);

    try {

        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save();
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};


exports.listSavedGameDataUserID = async (req, res) => {
    const { userID } = req.query;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;

    if (!userID) {
        return res.status(400).json({ message: 'Missing userID parameter' });
    }

    try {
        const total = await Save.countDocuments({ userID });
        const savedData = await Save.find({ userID })
          .sort({ gameDate: -1 })
          .skip((page - 1) * perPage)
          .limit(perPage);

        res.status(200).json({
            total,
            page,
            perPage,
            data: savedData
        });
    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).json({ message: 'Error fetching game data', error });
    }
};

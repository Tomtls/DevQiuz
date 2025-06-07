const express = require('express');
const { saveHighscore, save, getGlobal, getQuizScores } = require('../controllers/highscoreController');
const authToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authToken, saveHighscore);
router.post('/', authToken, save);
router.get('/global', getGlobal);
router.get('/quiz/:quizId', getQuizScores);

module.exports = router;
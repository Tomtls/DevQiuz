const express = require('express');
const { saveHighscore, save, getGlobal, getQuizScores } = require('../controllers/highscoreController');

const router = express.Router();

router.post('/', saveHighscore);
router.post('/', save);
router.get('/global', getGlobal);
router.get('/quiz/:quizId', getQuizScores);

module.exports = router;
const express = require('express');
const { getQuizzes, getAnswers, getHighscores, storeResults } = require('../controllers/jsquizController');
const authToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authToken, getQuizzes);
router.get('/answers', authToken, getAnswers);
router.get('/highscores', getHighscores);

router.post('/results', authToken, storeResults);

module.exports = router;

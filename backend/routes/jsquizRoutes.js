const express = require('express');
const { getQuizzes, getAnswers, getHighscores, storeResults } = require('../controllers/jsquizController');

const router = express.Router();

router.get('/', getQuizzes);
router.get('/answers', getAnswers);
router.get('/highscores', getHighscores);

router.post('/results', storeResults);

module.exports = router;

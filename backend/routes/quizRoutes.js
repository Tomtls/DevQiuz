const express = require('express');
const { getQuizzes, createQuiz } = require('../controllers/quizController');

const router = express.Router();

router.get('/', getQuizzes);
router.post('/', createQuiz);

module.exports = router;

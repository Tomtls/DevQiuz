const express = require('express');
const { getQuizzes, createQuiz, deleteQuiz } = require('../controllers/quizController');

const router = express.Router();

router.get('/', getQuizzes);
router.post('/', createQuiz);
router.delete('/:id', deleteQuiz);

module.exports = router;

const express = require('express');
const { getQuizzes, getDemoQuiz, getQuiz, createQuiz, deleteQuiz } = require('../controllers/quizController');
const authToken = require('../middleware/authMiddleware'); // Prüft ob der User eingeloggt ist (JWT-Token)
const isAdmin = require('../middleware/isAdmin');          // Prüft ob der User Admin ist (JWT-Token)

const router = express.Router();

router.get('/', getQuizzes);
router.get('/demo', getDemoQuiz);
router.get('/:id', authToken, getQuiz);
router.post('/', authToken, createQuiz);
router.delete('/:id', authToken, isAdmin, deleteQuiz);

module.exports = router;

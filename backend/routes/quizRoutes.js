const express = require('express');
const { getPublicQuizInfos, getDemoQuizById, getQuizById, createQuiz, deleteQuiz } = require('../controllers/quizController');
const authToken = require('../middleware/authMiddleware');  // Prüft ob der User eingeloggt ist (JWT-Token)
const isAdmin = require('../middleware/isAdmin');           // Prüft ob der User Admin ist (JWT-Token)
const router = express.Router();

// Öffentlich
router.get('/', getPublicQuizInfos);                        // alle sichtbaren Quizzes
router.get('/demo/:id', getDemoQuizById);                   // öffentliches Demo-Quiz

// Authentifiziert
router.get('/:id', authToken, getQuizById);                 // vollständiges Quiz (geschützt)
router.post('/', authToken, createQuiz);                    // neues Quiz (nur eingeloggte User)
router.delete('/:id', authToken, isAdmin, deleteQuiz);      // nur Admin darf löschen

module.exports = router;

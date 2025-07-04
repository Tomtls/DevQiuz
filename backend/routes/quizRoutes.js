import { Router } from 'express';
import { getPublicQuizInfos, getDemoQuizById, checkIfDemoQuiz, checkQuizAnswers, getQuizById, createQuiz, deleteQuiz } from '../controllers/quizController.js';
import authToken from '../middleware/authMiddleware.js';  // Prüft ob der User eingeloggt ist (JWT-Token)
import isAdmin from '../middleware/isAdmin.js';           // Prüft ob der User Admin ist (JWT-Token)
import rateLimit from 'express-rate-limit';            // Setzt ein Limit für Anfragen pro IP

const router = Router();

const submitLimit = rateLimit({
  windowMs: 60 * 1000,  // 1 Minute
  max: 10,              // max. 10 Anfragen pro IP
  message: 'Zu viele Quiz-Einreichungen – bitte warte kurz.'
})

// Öffentlich
router.get('/', getPublicQuizInfos);                        // alle sichtbaren Quizzes
router.get('/demo/:id', getDemoQuizById);                   // öffentliches Demo-Quiz
router.get('/is-demo/:id', checkIfDemoQuiz);                // prüft ob es ein Demo-Quiz ist
router.post('/demo/:id/submit', submitLimit, checkQuizAnswers)        // prüft die Antworten für das öffentliche Demo-Quiz

// Authentifiziert
router.get('/:id', authToken, getQuizById);                 // vollständiges Quiz (geschützt)
router.post('/:id/submit', authToken, submitLimit, checkQuizAnswers); // prüft ob Antworten richtig sind 
router.post('/', authToken, createQuiz);                    // neues Quiz (nur eingeloggte User)
router.delete('/:id', authToken, isAdmin, deleteQuiz);      // nur Admin darf löschen

export default router;

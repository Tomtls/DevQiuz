import { Router } from 'express';
import { getQuizzes, getAnswers, getHighscores, storeResults } from '../controllers/jsquizController.js';
import authToken from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authToken, getQuizzes);
router.get('/answers', authToken, getAnswers);
router.get('/highscores', getHighscores);

router.post('/results', authToken, storeResults);

export default router;

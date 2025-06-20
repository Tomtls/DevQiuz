import { Router } from 'express';
import { start, getHighscores, submitAnswer } from '../controllers/helloWorldController.js';
import authToken from '../middleware/authMiddleware.js';

const router = Router();

router.get('/highscores', getHighscores);
router.get('/start', authToken, start);

router.put('', authToken, submitAnswer);

export default router;
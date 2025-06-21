import { 
  getPublicQuizInfos as fetchPublicQuizInfos, 
  getQuizById as fetchQuizById, 
  getQuizWithAnswerById as fetchQuizWithAnswerById,
  createQuiz as saveQuiz, 
  deleteQuiz as removeQuiz 
} from '../services/quizService.js';
import { saveScoreQuizzes } from '../services/highscoreService.js';

export const getPublicQuizInfos = async (req, res) => {
  try {
    const quizzes = await fetchPublicQuizInfos();
    res.json(quizzes);
  } catch (err) {
    console.error('[getQuizzes]', err);
    res.status(500).json({ error: 'Fehler beim Laden der Quizzes' });
  }
}

export const getDemoQuizById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const quiz = await fetchQuizById(id);
    if (!quiz || !quiz.demo) { 
      return res.status(404).json({ error: 'Demo-Quiz nicht gefunden' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('[getDemoQuiz]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Demo-Quizzes' });
  }
}

export const checkIfDemoQuiz = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const quiz = await fetchQuizById(id);
    if (!quiz) { 
      return res.status(404).json({ demo: false });
    }
    res.json({ demo: !!quiz.demo });
  } catch (err) {
    console.error('[checkIfDemoQuiz]', err);
    res.status(500).json({ demo: false, error: 'Fehler beim Finden des Demo-Quizzes' });
  }
}

export const getQuizById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }

  try {
    const quiz = await fetchQuizById(id);
    res.json(quiz);
  } catch (err) {
    console.error('[getQuizById]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Quizzes' });
  }
}

export const checkQuizAnswers = async (req, res) => {
  const id = parseInt(req.params.id);
  const userAnswers = req.body.answer;
  const user = req.user;

  if (isNaN(id) || !Array.isArray(userAnswers)) return res.status(400).json({ error: 'Ungültige Daten' });

  try {
    const quiz = await fetchQuizWithAnswerById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz nicht gefunden' });
    if (!quiz.demo && !user) return res.status(404).json({ error: 'Nicht autorisiert – bitte einloggen' });

    const score = quiz.questions.reduce((acc, q, i) => {
      return acc + (q.answer === userAnswers[i] ? 1 : 0);
    }, 0);

    if (user) await saveScoreQuizzes(id, score, user);

    res.json({ score });
  } catch (err) {
    console.error('[checkQuizAnswers]', err);
    res.status(500).json({ error: 'Fehler beim Überprüfen der Antworten' });
  }
}

export const createQuiz = async (req, res) => {
  try {
    await saveQuiz(req.body);
    res.status(201).end();
  } catch (err) {
    console.error('[createQuiz]', err);
    res.status(400).json({ error: err.message || 'Ungültige Eingabe'})
  }
}

export const deleteQuiz = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }
  
  try {
    await removeQuiz(id);
    res.status(204).end();
  } catch (err) {
    console.error('[deleteQuiz]', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

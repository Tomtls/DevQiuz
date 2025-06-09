const quizService = require('../services/quizService');
const highscoreService = require('../services/highscoreService')

exports.getPublicQuizInfos = async (req, res) => {
  try {
    const quizzes = await quizService.getPublicQuizInfos();
    res.json(quizzes);
  } catch (err) {
    console.error('[getQuizzes]', err);
    res.status(500).json({ error: 'Fehler beim Laden der Quizzes' });
  }
};

exports.getDemoQuizById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const quiz = await quizService.getQuizById(id);
    if (!quiz || !quiz.demo) { 
      return res.status(404).json({ error: 'Demo-Quiz nicht gefunden' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('[getDemoQuiz]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Demo-Quizzes' });
  }
};

exports.checkIfDemoQuiz = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const quiz = await quizService.getQuizById(id);
    if (!quiz) { 
      return res.status(404).json({ demo: false });
    }
    res.json({ demo: !!quiz.demo });
  } catch (err) {
    console.error('[checkIfDemoQuiz]', err);
    res.status(500).json({ demo: false, error: 'Fehler beim Finden des Demo-Quizzes' });
  }
}

exports.getQuizById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }

  try {
    const quiz = await quizService.getQuizById(id);
    res.json(quiz);
  } catch (err) {
    console.error('[getQuizById]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Quizzes' });
  }
};

exports.checkQuizAnswers = async (req, res) => {
  const id = parseInt(req.params.id);
  const userAnswers = req.body.answer;
  const user = req.user;

  if (isNaN(id) || !Array.isArray(userAnswers)) return res.status(400).json({ error: 'Ungültige Daten' });

  try {
    const quizzes = await quizService.readQuizzes();
    const quiz = quizzes.find(q => Number(q.id) === id);
    if (!quiz) return res.status(404).json({ error: 'Quiz nicht gefunden' });
    if (!quiz.demo && !user) return res.status(404).json({ error: 'Nicht autorisiert – bitte einloggen' });

    const correctCount = quiz.questions.reduce((acc, q, i) => {
      return acc + (q.answer === userAnswers[i] ? 1 : 0);
    }, 0);

    if (user) await highscoreService.saveScore({quizId: id, username: user.username, userId: user.user_id, score: correctCount})

    res.json({ correctCount });
  } catch (err) {
    console.error('[checkQuizAnswers]', err);
    res.status(500).json({ error: 'Fehler beim Überprüfen der Antworten' });
  }
}

exports.createQuiz = async (req, res) => {
  try {
    const saved = await quizService.createQuiz(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error('[createQuiz]', err);
    res.status(400).json({ error: err.message || 'Ungültige Eingabe'})
  }
};

exports.deleteQuiz = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }
  
  try {
    await quizService.deleteQuiz(id);
    res.status(204).end();
  } catch (err) {
    console.error('[deleteQuiz]', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

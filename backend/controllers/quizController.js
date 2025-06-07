const quizService = require('../services/quizService');

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
    const quiz = await quizService.getQuizById();
    if (!quiz || !quiz.demo) { 
      return res.status(404).json({ error: 'Demo-Quiz nicht gefunden' });
    }
    res.json(quiz);
  } catch (err) {
    console.error('[getDemoQuiz]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Demo-Quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }

  try {
    const quiz = await quizService.getQuizById(id);
    res.json(quiz);
  } catch (err) {
    console.error('[getQuiz]', err);
    res.status(500).json({ error: 'Fehler beim Laden des Quizzes' });
  }
};

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

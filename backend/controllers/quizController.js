const quizService = require('../services/quizService');

exports.getQuizzes = (req, res) => {
  const quizzes = quizService.readQuizzes();
  res.json(quizzes);
};

exports.createQuiz = (req, res) => {
  const quiz = req.body;
  const saved = quizService.addQuiz(quiz);
  res.status(201).json(saved);
};

exports.deleteQuiz = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { return res.status(400).json({ error: 'Ungültige ID' }); }
    const saved = quizService.deleteQuiz(id);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

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

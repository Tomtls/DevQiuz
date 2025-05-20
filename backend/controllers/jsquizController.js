const jsquizService = require('../services/jsquizService');

exports.getQuizzes = (req, res) => {
  const quizzes = jsquizService.readQuizzes();
  res.json(quizzes);
};

exports.getAnswers = (req, res) => {
  const quizzes = jsquizService.readAnswers();
  res.json(quizzes);
};
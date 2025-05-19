const jsquizService = require('../services/jsquizService');

exports.getQuizzes = (req, res) => {
  const quizzes = jsquizService.readQuizzes();
  res.json(quizzes);
};
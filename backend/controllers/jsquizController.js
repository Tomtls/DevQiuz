const jsquizService = require('../services/jsquizService');

exports.getQuizzes = (req, res) => {
  const quizzes = jsquizService.readQuizzes();
  res.json(quizzes);
};

exports.getAnswers = (req, res) => {
  const quizzes = jsquizService.readAnswers();
  res.json(quizzes);
};

exports.getHighscores = (req, res) => {
  const highscores = jsquizService.getHighscores();
  res.json(highscores);
};

exports.storeResults = async (req, res) => {
  try {
    const resultData = req.body;
    if (!resultData || !Array.isArray(resultData.answers)) {
      return res.status(400).json({ message: 'Invalid data format.' });
    }

    await jsquizService.saveResults(resultData);
    res.status(201).json({ message: 'Result saved successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

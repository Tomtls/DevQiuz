const fs = require('fs');
const hs = require('../services/highscoreService');
const path = './data/highscores.json';

exports.saveHighscore = (req, res) => {
  const { quizId, username, score } = req.body;
  const raw = fs.existsSync(path) ? fs.readFileSync(path) : '[]';
  const data = JSON.parse(raw);
  data.push({ quizId, username, score, date: new Date() });
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.status(201).json({ success: true });
};

exports.save = (req, res) => {
  const { quizId, username, score } = req.body;
  hs.saveScore({ quizId, username, score });
  res.status(201).json({ success: true });
};

exports.getGlobal = (req, res) => {
  res.json(hs.getHighscoresGlobal());
};

exports.getQuizScores = (req, res) => {
  const quizId = req.params.quizId;
  res.json(hs.getHighscoresForQuiz(quizId));
};
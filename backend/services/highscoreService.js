const fs = require('fs');
const path = './data/highscores.json';

function readScores() {
  if (!fs.existsSync(path)) return [];
  const raw = fs.readFileSync(path, 'utf-8');
  return JSON.parse(raw || '[]');
}

function saveScore(entry) {
  const scores = readScores();
  scores.push(entry);
  fs.writeFileSync(path, JSON.stringify(scores, null, 2));
}

function getHighscoresGlobal() {
  const scores = readScores();
  const grouped = {};

  scores.forEach(s => {
    if (!grouped[s.username]) {
      grouped[s.username] = 0;
    }
    grouped[s.username] += s.score;
  });

  return Object.entries(grouped)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score);
}

function getHighscoresForQuiz(quizId) {
  return readScores()
    .filter(s => s.quizId == quizId)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  saveScore,
  getHighscoresGlobal,
  getHighscoresForQuiz
};

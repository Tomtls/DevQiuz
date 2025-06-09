const fs = require('fs');
const path = './data/highscores.json';

async function readScores() {
  if (!fs.existsSync(path)) return [];
  const raw = fs.readFileSync(path, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeScore(scores) {
  try { 
    await fs.writeFileSync(path, JSON.stringify(scores, null, 2), 'utf-8');
  } catch (err){
    console.error('[highscoreService] Fehler beim Schreiben der Datei:', err)
  }
}

async function saveScore({quizId, username, userId, score}) {
  const scores = await readScores();
  scores.push({
    quizId,
    username,
    userId,
    score,
    date: new Date()
  });
  await writeScore(scores);
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

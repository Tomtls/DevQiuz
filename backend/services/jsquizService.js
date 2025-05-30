const fs = require('fs');
const PATH = './data/jsquiz.json';
const PATH_RESULT = './data/jsquiz.results.json';
const PATH_USERS = './data/users.json';

function readQuizzes() {
  if (!fs.existsSync(PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
    return data.map(({ correctAnswer, explanation, ...rest }) => rest);
  } catch (err) { return []; }
}

function readAnswers(){
  if (!fs.existsSync(PATH)) return [];
  try { return JSON.parse(fs.readFileSync(PATH, 'utf8')); }
  catch (err){ return []; }
}

function getHighscores(){
  const users = readJson(PATH_USERS);
  const results = readJson(PATH_RESULT);
  const highscores = results.map(entry => {
    const user = users.find(u => u.user_id === entry.user_id);
    return {
      username: user ? user.username : 'Unbekannt',
      score: entry.score,
      timestamp: entry.timestamp
    };
  });

  highscores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return highscores;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } 
  catch (err) { return []; }
}

async function saveResults(resultData){
  try {
    let existing = [];
    try {
      const file = await fs.promises.readFile(PATH_RESULT, 'utf-8');
      existing = JSON.parse(file);
    } catch (e) { }

    existing.push(resultData);
    await fs.promises.writeFile(PATH_RESULT, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) { throw new Error('Fehler beim Speichern des Quiz-Resultats: ' + err.message); }
}

module.exports = {
  readQuizzes,
  readAnswers,
  getHighscores,
  saveResults,
};

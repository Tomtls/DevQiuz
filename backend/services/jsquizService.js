const fs = require('fs');
const path = './data/jsquiz.json';

function readQuizzes() {
  if (!fs.existsSync(path)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    return data.map(({ correctAnswer, explanation, ...rest }) => rest);
  } catch (err) {
    console.error('Quiz-Datei konnte nicht gelesen werden:', err.message);
    return [];
  }
}

function readAnswers(){
  if (!fs.existsSync(path)) return [];
  try { return JSON.parse(fs.readFileSync(path, 'utf8')); }
  catch (err){
    console.error('Quiz-Datei konnte nicht gelesen werden:', err.message);
    return [];
  }
}

module.exports = {
  readQuizzes,
  readAnswers,
};

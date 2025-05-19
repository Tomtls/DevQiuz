const fs = require('fs');
const path = './data/quizzes.json';

function readQuizzes() {
  if (!fs.existsSync(path)) return [];
  try {
    const raw = fs.readFileSync(path, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Quiz-Datei konnte nicht gelesen werden:', err.message);
    return [];
  }
}

function writeQuizzes(quizzes) {
  fs.writeFileSync(path, JSON.stringify(quizzes, null, 2));
}

function addQuiz(quiz) {
  const quizzes = readQuizzes();
  const newQuiz = {
    id: Date.now(),
    ...quiz
  };
  quizzes.push(newQuiz);
  writeQuizzes(quizzes);
  return newQuiz;
}

module.exports = {
  readQuizzes,
  addQuiz
};

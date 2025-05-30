const fs = require('fs');
const path = './data/quizzes.json';

function readQuizzes() {
  if (!fs.existsSync(path)) return [];
  try {
    const raw = fs.readFileSync(path, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) { return []; }
}

function writeQuizzes(quizzes) {
  fs.writeFileSync(path, JSON.stringify(quizzes, null, 2));
}

function addQuiz(quiz) {
  const quizzes = readQuizzes();
  const maxId = quizzes.reduce((max, quiz) => Math.max(max, quiz.id || 0), 0);
  const newQuiz = { id: maxId + 1, ...quiz };
  quizzes.push(newQuiz);
  writeQuizzes(quizzes);
  return newQuiz;
}

function deleteQuiz(id){
  let quizzes = readQuizzes();
  quizzes = quizzes.filter(quiz => quiz.id !== id);
  writeQuizzes(quizzes);
}

module.exports = {
  readQuizzes,
  addQuiz,
  deleteQuiz,
};

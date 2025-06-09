const fs = require('fs/promises');
const path = './data/quizzes.json';

async function getPublicQuizInfos() {
  const quizzes = await readQuizzes();
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    demo: q.demo ?? false,
    questionsCount: Array.isArray(q.questions) ? q.questions.length : 0
  }));
}

async function getQuizById(id, quizzes = null) {
  quizzes = quizzes || await readQuizzes();
  quiz = quizzes.find(quiz => Number(quiz.id) === Number(id)) || null;
  if(!quiz) return null;
  return {
    id: quiz.id,
    title: quiz.title,
    demo: quiz.demo ?? false,
    questions: quiz.questions.map(q => ({
      text: q.text,
      options: q.options
    }))
  }
}

async function createQuiz(quiz) {
  if (!isValidQuiz(quiz)) throw new Error('[QuizService] Ungültiges Quiz-Format');

  const quizzes = await readQuizzes();
  const maxId = quizzes.reduce((max, quiz) => Math.max(max, quiz.id || 0), 0);
  const newQuiz = { id: maxId + 1, ...quiz };
  quizzes.push(newQuiz);
  await writeQuizzes(quizzes);
  return newQuiz;
}

async function deleteQuiz(id) {
  let quizzes =await readQuizzes();
  const initialLength = quizzes.length;
  quizzes = quizzes.filter(quiz => Number(quiz.id) !== Number(id));

  if(quizzes.length < initialLength) await writeQuizzes(quizzes);
  else console.warn(`[QuizService] Kein Quiz mit ID ${id} gefunden`)
}

//#region Hilfsfunktionen
async function readQuizzes() {
  try {
    const raw = await fs.readFile(path, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) { 
    console.error('[QuizService] Fehler beim Lesen der Datei:', err);
    return []; 
  }
}

async function writeQuizzes(quizzes) {
  try { 
    await fs.writeFileSync(path, JSON.stringify(quizzes, null, 2));
  } catch (err){
    console.error('[QuizService] Fehler beim Schreiben der Datei:', err)
  }
}

function isValidQuiz(quiz) {
  return (
    quiz && 
    typeof quiz.title === 'string' &&
    Array.isArray(quiz.questions) &&
    quiz.questions.every(q =>
      typeof q.text === 'string' &&
      Array.isArray(q.options) &&
      typeof q.answer === 'string'
    )
  )
}
//#endregion

//#region Exports
module.exports = {
  getPublicQuizInfos,
  getQuizById,
  createQuiz,
  deleteQuiz,
  readQuizzes,
};

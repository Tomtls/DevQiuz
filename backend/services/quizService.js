import { readJson, writeJson } from "./fileService.js";

//#region Constants

// Path to the quiz data file
const QUIZ_PATH = './data/quizzes.quiz.json';

//#endregion

//#region Utils

/**
 * Validates the structure of a quiz object.
 *
 * @param {object} quiz - The quiz object to validate
 * @returns {boolean} True if valid, false otherwise
 */
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

//#region Get Functions

/**
 * Returns public info for all quizzes (for quiz list / overview).
 * Does not expose question content or answers.
 */
export async function getPublicQuizInfos() {
  const quizzes = await readJson(QUIZ_PATH);

  // Return only metadata needed for quiz overviews
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    demo: q.demo ?? false,
    questionsCount: Array.isArray(q.questions) ? q.questions.length : 0
  }));
}

/**
 * Returns a full quiz by ID, but only with visible question text and options (no answers).
 *
 * @param {number|string} id - The quiz ID to retrieve
 * @returns {Promise<object|null>} The quiz object or null if not found
 */
export async function getQuizById(id) {
  const quizzes = await readJson(QUIZ_PATH);

  // Find quiz by ID, casting both to numbers for safe comparison
  const quiz = quizzes.find(quiz => Number(quiz.id) === Number(id)) || null;

  // Return null if quiz was not found
  if(!quiz) return null;

  // Return quiz info without answers
  return {
    id: quiz.id,
    title: quiz.title,
    demo: quiz.demo ?? false,
    questions: quiz.questions.map(q => ({
      text: q.text,
      options: q.options // answer is excluded
    }))
  }
}

//#endregion

//#region Post Functions

/**
 * Creates and stores a new quiz.
 *
 * @param {object} quiz - The quiz to be created
 * @returns {Promise<object>} The created quiz with generated ID
 */
export async function createQuiz(quiz) {
  // Validate input structure
  if (!isValidQuiz(quiz)) throw new Error('[QuizService] Ungültiges Quiz-Format');

  const quizzes = await readJson(QUIZ_PATH);

  // Determine next available ID (based on highest existing)
  const maxId = quizzes.reduce((max, quiz) => Math.max(max, quiz.id || 0), 0);

  // Assign ID and add new quiz to the array
  const newQuiz = { id: maxId + 1, ...quiz };
  quizzes.push(newQuiz);

  // Save updated quiz list
  await writeJson(QUIZ_PATH, quizzes);

  return newQuiz;
}

//#endregion

//#region Delete Function

/**
 * Deletes a quiz by ID if it exists.
 *
 * @param {number|string} id - The ID of the quiz to delete
 */
export async function deleteQuiz(id) {
  let quizzes = await readJson(QUIZ_PATH);
  const initialLength = quizzes.length;

  // Remove the quiz with matching ID
  quizzes = quizzes.filter(quiz => Number(quiz.id) !== Number(id));

  // Save only if a quiz was actually removed
  if(quizzes.length < initialLength) await writeJson(QUIZ_PATH, quizzes);
  else console.warn(`[QuizService] Kein Quiz mit ID ${id} gefunden`)
}

//#endregion
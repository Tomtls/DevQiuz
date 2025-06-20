import { readJson } from "./fileService.js";

const PATH = './data/jsquiz.quiz.json';

/**
 * Reads the quiz file and returns quiz data without the correct answer and explanation.
 * Used for showing questions to the user.
 *
 * @returns {Promise<object[]>} Filtered quiz objects (no correctAnswer or explanation)
 */
export async function readQuizzes() {
  const data = await readJson(PATH);

  // Remove correctAnswer and explanation for frontend-safe questions
  return data.map(({ correctAnswer, explanation, ...rest }) => rest);
}

/**
 * Reads the full quiz file including correct answers and explanations.
 * Used internally for grading and feedback.
 *
 * @returns {Promise<object[]>} Full quiz objects
 */
export async function readAnswers() {
  return await readJson(PATH);
}
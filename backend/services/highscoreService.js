import { readJson, writeJson } from "./fileService.js";

//#region Constants

// File path for storing Hello World quiz results
const HELLOWORLD_RESULTS_PATH = './data/helloWorld.results.json';

// File path for storing normal quiz results
const QUIZZES_RESULTS_PATH = './data/quizzes.results.json';

// File path for storing JS is weird quiz results
const JSQUIZ_RESULTS_PATH = './data/jsquiz.results.json';

// Path to the user data file
const USERS_PATH = './data/users.json';

//#endregion

//#region Save Functions

/**
 * Saves a score entry for the Hello World quiz.
 * Adds a new object containing user information, score, and date.
 *
 * @param {number} score - The achieved score
 * @param {object} user - The user object (must contain user_id and username)
 */
export async function saveScoreHelloWorld(score, user) {
  // Read existing scores from file
  const scores = await readJson(HELLOWORLD_RESULTS_PATH);

  // Add new result to the list
  scores.push({
    user_id: user.user_id,
    username: user.username,
    score,
    date: new Date()
  });

  // Write updated list back to file
  await writeJson(HELLOWORLD_RESULTS_PATH, scores);
}

/**
 * Saves a score entry for a specific quiz.
 * Adds a result with quiz ID, user information, score, and date.
 *
 * @param {string} quizId - The unique identifier of the quiz
 * @param {number} score - The achieved score
 * @param {object} user - The user object (must contain user_id and username)
 */
export async function saveScoreQuizzes(quizId, score, user) {
  // Read existing scores from file
  const scores = await readJson(QUIZZES_RESULTS_PATH);

  // Add new result to the list
  scores.push({
    quizId,
    user_id: user.user_id,
    username: user.username,
    score,
    date: new Date()
  });

  // Write updated list back to file
  await writeJson(QUIZZES_RESULTS_PATH, scores);
}

/**
 * Saves a score entry for the JS is weird quiz.
 * Adds a new object containing user_id, score, array of answers and timestamp (date)
 *
 * @param {object} resultData - The result object to be stored
 * @returns {Promise<void>}
 */
export async function saveScoreJSQuiz(resultData) {
  // Read existing scores from file
  const results = await readJson(JSQUIZ_RESULTS_PATH);
  
  // Add new result to the list
  results.push(resultData);
  
  // Write updated list back to file
  await writeJson(JSQUIZ_RESULTS_PATH, results);
}

//#endregion

//#region Get Functions

/**
 * Returns a sorted list of Scores for the JS is weird quiz,
 * combining result entries with usernames from the user list.
 *
 * @returns {Promise<object[]>} Sorted Scores with username, score, and timestamp
 */
export async function getScoresJSQuiz() {
  const users = await readJson(USERS_PATH);
  const results = await readJson(JSQUIZ_RESULTS_PATH);

  const scores = results.map(entry => {
    const user = users.find(u => u.user_id === entry.user_id);
    return {
      username: user ? user.username : 'Unbekannt',
      score: entry.score,
      timestamp: entry.date || entry.timestamp || null // fallback handling
    };
  });

  // Sort by score descending, then by timestamp ascending
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return scores;
}

/**
 * Returns a sorted list of Scores for the Hello World quiz,
 *
 * @returns {Promise<object[]>} Sorted Scores with username, score, and timestamp
 */
export async function getScoresHelloWorld() {
  const scores = await readJson(HELLOWORLD_RESULTS_PATH);

  const reducedScores = scores.map(({ username, score, date }) => ({
    username,
    score,
    date
  }));

  // Sort by score descending, then by timestamp ascending
  reducedScores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.date) - new Date(b.date);
  })

  return reducedScores;
}

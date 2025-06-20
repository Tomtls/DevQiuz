import { readJson } from "./fileService.js";
import { saveScoreHelloWorld } from "./highscoreService.js"

//#region Constants

// Path to the Hello World quiz data file
const PATH = './data/helloWorld.quiz.json';

// Game settings
const INITIAL_LIVES = 5;
const POINTS_PER_CORRECT = 1;

//#endregion

//#region Game State

// Game state object – holds the current session's progress
let state = {
  score: 0,
  lives: INITIAL_LIVES,
  currentQuestion: 0,
  shuffledIndexes: [],  // will be loaded dynamically
  quiz: []              // will be loaded dynamically
}

//#endregion

//#region Utils

/**
 * Utility function to shuffle an array using the Fisher-Yates algorithm
 * @param {any[]} array Array to shuffle
 * @returns {any[]} Shuffled array
 */
function shuffle(array){
  const shuffled = array.slice(); // shallow copy
  for (let i = 0; i < shuffled.length - 1; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
}

//#endregion

//#region Game Logic

/**
 * Initializes the game by loading quiz data, shuffling questions,
 * and resetting the game state.
 * @returns {object} - The first question and initial game info
 */
export async function startGame() {
  const quiz = await readJson(PATH);

  // Validate loaded quiz
  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new Error('Quiz data is invalid or empty.');
  }

  const indexes = quiz.map((_, index) => index);
  const shuffled = shuffle(indexes);

  state = { 
    score: 0, 
    lives: INITIAL_LIVES, 
    currentIndex: 0,
    shuffledIndexes: shuffled,
    quiz: quiz
  };

  const first = quiz[shuffled[0]];

  return {
    nextQuestion: first,
    score: state.score,
    lives: state.lives,
    object_id: first.object_id
  }
}

/**
 * Handles user answer input and game progression.
 * @param {string} selectedKey - The answer key chosen by the user
 * @param {string} user - The current user's identifier (for highscore tracking)
 * @returns {object} - Result of the answer and game state update
 */
export async function checkAnswer(selectedKey, user) {
  const { currentIndex, shuffledIndexes, quiz } = state;

  const current = quiz[shuffledIndexes[currentIndex]];

  // Validate question structure
  if (!current || !current.options || !Array.isArray(current.options)) {
    return { error: 'Invalid question format.' };
  }

  const correctIndex = current.correctAnswer;
  const correctOption = current.options[correctIndex];
  const isCorrect = correctOption && correctOption.key === selectedKey;

  // Update state based on answer
  if (isCorrect) { 
    state.score += POINTS_PER_CORRECT;
  } else {
    state.lives -= 1;

    // If player loses all lives → game over + save score
    if(state.lives === 0){ 
      await saveScoreHelloWorld(state.score, user); 
      return { 
        gameOver: true,
        correct: correctOption,
        score: state.score,
        lives: state.lives
      };
    }
  }

  state.currentIndex++;

  // If last question reached after answer
  if (state.currentIndex >= state.shuffledIndexes.length) {
    await saveScoreHelloWorld(state.score, user); 
    return { 
      gameOver: true,
      correct: isCorrect ? null : correctOption,
      score: state.score,
      lives: state.lives
    };
  }

  const next = quiz[shuffledIndexes[state.currentIndex]];

  return {
    gameOver: false,
    correct: isCorrect ? null : correctOption,
    nextQuestion: next,
    score: state.score,
    lives: state.lives,
    object_id: next.object_id
  };
}

//#endregion
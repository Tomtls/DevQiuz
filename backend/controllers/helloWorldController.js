import { getScoresHelloWorld } from "../services/highscoreService.js";
import { startGame, checkAnswer } from '../services/helloWorldService.js';

export const start = async (req, res) => {
  const result = await startGame();

  res.json({
    status: "ready",
    game: {
      object_id: result.object_id,
      score: result.score,
      lives: result.lives
    },
      variant: {
      snippet: result.nextQuestion.snippet,
      options: result.nextQuestion.options
    },
    correct: null
  })
}

export const submitAnswer = async (req, res) => {
  const { option } = req.body;
  const result = await checkAnswer(option, req.user);

  res.json({
    status: result.gameOver ? "died" : "ready",
    game: {
      object_id: result.object_id,
      score: result.score,
      lives: result.lives
    },
    variant: result.nextQuestion ? {
      snippet: result.nextQuestion.snippet,
      options: result.nextQuestion.options
    } : [],
    correct: result.correct
  });
}

export const getHighscores = async (req, res) => {
  const highscores = await getScoresHelloWorld();
  res.json(highscores);
};

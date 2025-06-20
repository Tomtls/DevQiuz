import { getScoresJSQuiz, saveScoreJSQuiz } from "../services/highscoreService.js";
import { readQuizzes, readAnswers } from '../services/jsquizService.js';

export const getQuizzes = async (req, res) => {
  const quizzes = await readQuizzes();
  res.json(quizzes);
};

export const getAnswers = async (req, res) => {
  const quizzes = await readAnswers();
  res.json(quizzes);
};

export const getHighscores = async (req, res) => {
  const highscores = await getScoresJSQuiz();
  res.json(highscores);
};

export const storeResults = async (req, res) => {
  try {
    const resultData = req.body;
    if (!resultData || !Array.isArray(resultData.answers)) {
      return res.status(400).json({ message: 'Invalid data format.' });
    }

    await saveScoreJSQuiz(resultData);
    res.status(201).json({ message: 'Result saved successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

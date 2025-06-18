const helloWolrdService = require('../services/helloWorldService');

exports.test = (req, res) =>{
  const result = helloWolrdService.test();
  res.json(result);
}
exports.start = (req, res) => {
  const result = helloWolrdService.startGame();
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
exports.submitAnswer = (req, res) => {
  const { option } = req.body;
  const result = helloWolrdService.checkAnswer(option);

  res.json({
    status: result.lives > 0 ? "ready" : "died",
    game: {
      object_id: result.object_id,
      score: result.score,
      lives: result.lives
    },
    variant: {
      snippet: result.nextQuestion.snippet,
      options: result.nextQuestion.options
    },
    correct: result.correct
  });
}

const fs = require("fs");
const PATH = './data/helloworld.json';

let state = {
  score: 0,
  lives: 5,
  currentQuestion: null
}

function loadQuiz() {
  if (!fs.existsSync(PATH)) return [];
  try {
    const data = fs.readFileSync(PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return []; }
}

const quiz = loadQuiz();

function test(){
  return quiz.slice().sort((a,b) => a.snippet.localeCompare(b.snippet));
} 
function startGame() {
  state = { score: 0, lives: 3, currentIndex: 0 };

  const first = quiz[0];

  return {
    nextQuestion: first,
    score: state.score,
    lives: state.lives,
    object_id: first.object_id
  }
}
function checkAnswer(selectedKey) {
  const current = quiz[state.currentIndex];
  const correctIndex = current.correctAnswer;
  const isCorrect = current.options[correctIndex].key === selectedKey;
  
  if (isCorrect) {
    state.score += 10;
  } else {
    state.lives -= 1;
  }
  
  const previous = current;
  const correctOption = previous.options[correctIndex]
  state.currentIndex = (state.currentIndex + 1) % quiz.length;
  
  return {
    correct: isCorrect ? null : { ...correctOption, snippet: previous.snippet },
    nextQuestion: quiz[state.currentIndex],
    score: state.score,
    lives: state.lives,
    object_id: quiz[state.currentIndex].object_id
  };
}



//#region Exports
module.exports = {
  test,
  startGame,
  checkAnswer,
};

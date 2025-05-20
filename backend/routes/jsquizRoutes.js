const express = require('express');
const { getQuizzes, getAnswers } = require('../controllers/jsquizController');

const router = express.Router();

router.get('/', getQuizzes);
router.get('/answers', getAnswers);

module.exports = router;

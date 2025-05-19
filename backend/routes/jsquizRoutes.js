const express = require('express');
const { getQuizzes } = require('../controllers/jsquizController');

const router = express.Router();

router.get('/', getQuizzes);

module.exports = router;

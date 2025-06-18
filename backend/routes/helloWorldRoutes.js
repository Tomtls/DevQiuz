const express = require('express');
const {test, start, submitAnswer } = require('../controllers/helloWorldController');
const authToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/start', authToken, start);
router.get('/test', test);
router.put('', authToken, submitAnswer);

module.exports = router;
const express = require('express');
const createQuiz = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken,createQuiz);

module.exports = router;

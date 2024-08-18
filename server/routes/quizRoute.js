const express = require('express');
const { createQuiz, deleteQuestion, deleteOption, deleteQuiz, updateQuiz, getTrendingQuizzes, playQuiz, increaseImpressionOnQuiz } = require('../controllers/quizController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/create', verifyToken, createQuiz);
router.delete('/question/:questionId', verifyToken, deleteQuestion);
router.delete('/question/:questionId/option/:optionId', verifyToken, deleteOption);
router.delete('/quiz/:quizId', verifyToken, deleteQuiz);
router.put('/quiz/:quizId',verifyToken, updateQuiz);
router.get("/trending", verifyToken, getTrendingQuizzes);
router.put("/:quizId",increaseImpressionOnQuiz)
router.patch("/playQuiz", playQuiz);
module.exports = router;


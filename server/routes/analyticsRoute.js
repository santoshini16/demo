const express = require('express');
const router = express.Router();
const {
  getAllMyQuizzes,
  getSingleQuestion,
  getSingleQuiz,
  getAllQuestionsOfAQuiz,
  getDashboardInfo,
} = require('../controllers/analyticsController'); // or `quizController` if using the same controller
const verifyToken = require('../middleware/verifyToken');

// Route to get all quizzes created by the user
router.get('/quizzes', verifyToken, getAllMyQuizzes);

// Route to get a single question by ID
router.get('/questions/:questionId', verifyToken, getSingleQuestion);

// Route to get a single quiz by ID
router.get('/quizzes/:quizId', getSingleQuiz);

// Route to get all questions of a specific quiz for question-wise analysis
router.get('/quizzes/questions/:quizId', getAllQuestionsOfAQuiz);

// Route to get dashboard information
router.get('/dashboard', verifyToken, getDashboardInfo);

module.exports = router;

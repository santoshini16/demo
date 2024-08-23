const Quiz = require('../model/quiz');
const Question = require('../model/question');
const mongoose = require('mongoose')

// Utility function for creating custom error responses
const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Get all quizzes created by the user
const getAllMyQuizzes = async (req, res, next) => {
  try {
    const user = req.user;
   
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const quizzes = await Quiz.find({ userId: user.userId });
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};

// Get a single question by ID
const getSingleQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return next(createError(404, "Question not found"));
    }

    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};

// Get a single quiz by ID
const getSingleQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(createError(404, "Quiz not found"));
    }

    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

// Get all questions of a quiz for question-wise analysis
const getAllQuestionsOfAQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(createError(404, "Quiz not found!"));
    }

    const questions = await Promise.all(
      quiz.questions.map(async (questionId) => {
        return await Question.findById(questionId);
      })
    );

    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const getDashboardInfo = async (req, res) => {
  try {
    const user = req.user;
    console.log("dashboard user:", user);

    if (!user || !user.userId) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Directly use userId in queries assuming it's a string
    const userId = new mongoose.Types.ObjectId(user.userId);
    console.log("userId:", userId);

    // 1. Count total quizzes created by user
    const totalQuizzesCreatedByUser = await Quiz.countDocuments({ userId });
    console.log("Total quizzes created by user:", totalQuizzesCreatedByUser);

    // 2. Aggregate total questions created by user using $lookup
    const totalQuestionCreatedByUser = await Quiz.aggregate([
      { $match: { userId } }, // Use userId directly if it's a string
      {
        $lookup: {
          from: 'questions', // Ensure this matches the collection name exactly
          localField: 'questions',
          foreignField: '_id',
          as: 'questionDetails',
        },
      },
      { $unwind: '$questionDetails' },
      { $group: { _id: null, numberOfQuestions: { $sum: 1 } } },
    ]);
    console.log("Total questions created by user:", totalQuestionCreatedByUser);

    // 3. Aggregate total impressions of a user's quizzes
    const totalImpressionsOfAUser = await Quiz.aggregate([
      { $match: { userId } }, // Use userId directly if it's a string
      { $group: { _id: null, impressionSum: { $sum: '$impressions' } } },
    ]);
    console.log("Total impressions of user:", totalImpressionsOfAUser);

    // 4. Respond with the aggregated data
    res.status(200).json({
      totalQuizzesCreatedByUser,
      totalQuestionCreatedByUser: totalQuestionCreatedByUser[0]?.numberOfQuestions || 0,
      totalImpressions: totalImpressionsOfAUser[0]?.impressionSum || 0,
    });

  } catch (error) {
    console.error("Error in getDashboardInfo:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



module.exports = {
  getAllMyQuizzes,
  getSingleQuestion,
  getSingleQuiz,
  getAllQuestionsOfAQuiz,
  getDashboardInfo,
};


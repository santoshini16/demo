const Quiz = require('../model/quiz');
const Question = require('../model/question');

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

    const quizzes = await Quiz.find({ userId: user._id });
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

// Get dashboard information
const getDashboardInfo = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return next(createError(404, "User not found!"));

    const totalQuizzesCreatedByUser = await Quiz.countDocuments({
      userId: user._id,
    });

    const totalQuestionCreatedByUser = await Quiz.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $unwind: "$questions",
      },
      {
        $group: {
          _id: null,
          numberOfQuestions: { $sum: 1 },
        },
      },
    ]);

    const totalImpressionsOfAUser = await Quiz.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $group: {
          _id: null,
          impressionSum: { $sum: "$impressions" },
        },
      },
    ]);

    res.status(200).json({
      totalQuizzesCreatedByUser,
      totalQuestionCreatedByUser: totalQuestionCreatedByUser[0]?.numberOfQuestions || 0,
      totalImpressions: totalImpressionsOfAUser[0]?.impressionSum || 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMyQuizzes,
  getSingleQuestion,
  getSingleQuiz,
  getAllQuestionsOfAQuiz,
  getDashboardInfo,
};


const Quiz = require('../model/quiz');
const Question = require('../model/question');

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, timer, optionType, questions } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Validate required fields
    if (!quizName || !quizType) {
      return res.status(400).json({ message: "Quiz name and quiz type are required." });
    }
    if (!["QA", "POLL"].includes(quizType)) {
      return res.status(400).json({ message: "Invalid quiz type." });
    }
    if (!["text", "image", "textImage"].includes(optionType)) {
      return res.status(400).json({ message: "Invalid option type." });
    }

    // Create questions and retrieve their IDs
    const questionIds = await Promise.all(
      questions.map(async (q) => {
        const newQuestion = await Question.create({
          question: q.question,
          quizType: q.quizType,
          optionType: q.optionType,
          correctAnswer: q.correctAnswer,
          options: q.options,
          timer: q.timer,
        });
        return newQuestion._id;
      })
    );

    // Create the quiz with the question IDs
    const newQuiz = await Quiz.create({
      userId: user._id,
      quizName,
      quizType,
      timer: timer || 0, // Default to 0 if not provided
      optionType,
      questions: questionIds,
    });

    // Return the created quiz
    return res.status(201).json(newQuiz);

  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Remove question from any quiz that references it
    await Quiz.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    // Delete the question
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found!" });
    }

    return res.status(200).json({ message: "Question deleted successfully!" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete an option by ID
const deleteOption = async (req, res) => {
  try {
    const { questionId, optionId } = req.params;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $pull: { options: { _id: optionId } } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question or Option not found!" });
    }

    return res.status(200).json({ message: "Option deleted successfully!", updatedQuestion });
  } catch (error) {
    console.error("Error deleting option:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }

    return res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update a quiz by ID
const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { quizName, quizType, timer, optionType, questions } = req.body;

    // Validate required fields
    if (!quizName || !quizType) {
      return res.status(400).json({ message: "Quiz name and quiz type are required." });
    }
    if (!["QA", "POLL"].includes(quizType)) {
      return res.status(400).json({ message: "Invalid quiz type." });
    }
    if (!["text", "image", "textImage"].includes(optionType)) {
      return res.status(400).json({ message: "Invalid option type." });
    }

    // Handle question objects and convert them to ObjectIds
    const questionIds = await Promise.all(
      questions.map(async (q) => {
        // If the question has an _id, assume it's already in the database
        if (q._id) {
          return q._id;
        }
        // Otherwise, create a new question and return its _id
        const newQuestion = await Question.create({
          question: q.question,
          quizType: q.quizType,
          optionType: q.optionType,
          correctAnswer: q.correctAnswer,
          options: q.options,
          timer: q.timer,
        });
        return newQuestion._id;
      })
    );

    // Clear the existing questions array before updating
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        quizName,
        quizType,
        timer: timer || 0, // Default to 0 if not provided
        optionType,
        questions: questionIds, // Replace with new questions
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }

    return res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Play a quiz and calculate the score
const playQuiz = async (req, res) => {
  try {
    const { quizId, userResponses } = req.body;

    // Validate input
    if (!quizId || !Array.isArray(userResponses)) {
      return res.status(400).json({ message: "Quiz ID and user responses are required." });
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }

    let score = 0;

    // Process the user responses based on quiz type
    if (quiz.quizType === 'QA') {
      // QA Quiz
      for (const response of userResponses) {
        const question = await Question.findById(response.questionId);
        if (!question) {
          continue; // Skip if the question is not found
        }

        if (response.chosenAnswer === question.correctAnswer) {
          score += 1; // Increment score if the answer is correct
          await question.updateOne({ $inc: { answeredCorrectly: 1 } });
        } else {
          await question.updateOne({ $inc: { answeredIncorrectly: 1 } });
        }

        await question.updateOne({ $inc: { attempts: 1 } });
      }
    } else if (quiz.quizType === 'POLL') {
      // POLL Quiz
      for (const response of userResponses) {
        const question = await Question.findById(response.questionId);
        if (!question) {
          continue; // Skip if the question is not found
        }

        switch (response.chosenAnswer) {
          case 1:
            await question.updateOne({ $inc: { optedPollOption1: 1 } });
            break;
          case 2:
            await question.updateOne({ $inc: { optedPollOption2: 1 } });
            break;
          case 3:
            await question.updateOne({ $inc: { optedPollOption3: 1 } });
            break;
          case 4:
            await question.updateOne({ $inc: { optedPollOption4: 1 } });
            break;
          default:
            return res.status(400).json({ message: "Invalid poll option selected." });
        }
      }
    } else {
      return res.status(400).json({ message: "Invalid quiz type." });
    }

    return res.status(200).json({ message: "Quiz played successfully!", score });
  } catch (error) {
    console.error("Error playing quiz:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Increase impression count for a quiz
const increaseImpressionOnQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }

    await quiz.updateOne({ $inc: { impressions: 1 } });

    return res.status(200).json({ message: "Impression count updated successfully!" });
  } catch (error) {
    console.error("Error increasing impression count:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get trending quizzes based on impressions
const getTrendingQuizzes = async (req, res) => {
  try {
    const trendingQuizzes = await Quiz.find()
      .sort({ impressions: -1 }) // Sort by impressions in descending order
      .limit(10); // Limit to top 10 trending quizzes

    return res.status(200).json(trendingQuizzes);
  } catch (error) {
    console.error("Error fetching trending quizzes:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createQuiz,
  deleteQuestion,
  deleteOption,
  deleteQuiz,
  updateQuiz,
  playQuiz,
  increaseImpressionOnQuiz,
  getTrendingQuizzes,
};





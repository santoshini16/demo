const Quiz = require('../model/quiz');
const Question = require('../model/question');
const User = require('../model/user')

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, timer, optionType, questions } = req.body;

    const userId = req.user?.userId; // Extract userId from req.user

    if (!userId) {
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

    console.log("create quiz user:", userId);

    // Create the quiz with the question IDs
    const newQuiz = await Quiz.create({
      userId,
      quizName,
      quizType,
      timer: timer || 0, // Default to 0 if not provided
      optionType,
      questions: questionIds,
    });

    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found in the database!" });
    }

    // Update the user's quizzes array
    user.quizzes.push(newQuiz._id);
    await user.save(); // Save the updated user

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

const playQuiz = async (req, res) => {
  try {
    const { quizType, questions } = req.body;

    let score = 0;

    // when quizType is QA
    if (quizType === "QA") {
      await Promise.all(
        questions.map(async (q) => {
          const ques = await Question.findById(q.questionId);

          if (!ques) {
            return res.status(404).json({ message: "Question not found!" });
          }

          if (q.chosenAnswer === ques.correctAnswer) {
            await ques.updateOne({ $inc: { answeredCorrectly: 1 } });  // Correct field name
            score += 1;
          } else {
            await ques.updateOne({ $inc: { answeredIncorrectly: 1 } }); // Correct field name
          }

          await ques.updateOne({ $inc: { attempts: 1 } });
        })
      );
    }

    // when quizType is POLL
    if (quizType === "POLL") {
      await Promise.all(
        questions.map(async (q) => {
          const ques = await Question.findById(q.questionId);

          if (!ques) {
            return res.status(404).json({ message: "Question not found!" });
          }

          switch (q.chosenAnswer) {
            case 1:
              await ques.updateOne({ $inc: { optedPollOption1: 1 } });
              break;
            case 2:
              await ques.updateOne({ $inc: { optedPollOption2: 1 } });
              break;
            case 3:
              await ques.updateOne({ $inc: { optedPollOption3: 1 } });
              break;
            case 4:
              await ques.updateOne({ $inc: { optedPollOption4: 1 } });
              break;
            default:
              break;
          }
        })
      );
    }

    res.status(200).json({ message: "Quiz played successfully!", score });
  } catch (error) {
    console.error("Error playing quiz:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// Edit a quiz
const updateQuiz = async (req, res) => {
  try {
    const { timer, optionType, questions } = req.body;
    const { quizId } = req.params;
    console.log(quizId)
    const user = req.user;
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const realQuiz = await Quiz.findById(quizId);
    console.log(realQuiz)
    if (!realQuiz) {
      return res.status(404).json({ message: "Quiz not found!" });
    }
    

    // if (realQuiz._id.toString() !== user.userId.toString()) {
    //   return res.status(403).json({ message: "Action forbidden!" });
    // }

    // Create new questions and get their IDs
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

    // Update the quiz with new data
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        timer,
        optionType,
        questions: questionIds,
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      message: "Quiz updated successfully!",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
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
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userId = user.userId; 

    const trendingQuizzes = await Quiz.find({ 
        userId, 
        impressions: { $gt: 10 } 
      })
      .sort({ impressions: -1 }) 
      .limit(10); 

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






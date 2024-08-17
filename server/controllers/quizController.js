const Quiz = require('../model/quiz');
const Question = require('../model/question');

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

module.exports = createQuiz;



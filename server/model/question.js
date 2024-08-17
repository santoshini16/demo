const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
});

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      enum: ["QA", "POLL"],
    },
    optionType: {
      type: String,
      enum: ["text", "image", "textImage"],
    },
    timer: {
      type: Number,
      default: 0,
    },
    options: [optionSchema], // Embed optionSchema
    correctAnswer: {
      type: Number,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    optedPollOptions: [
      {
        type: Number,
        default: 0,
      },
    ],
    attempts: {
      type: Number,
      default: 0,
    },
    answeredCorrectly: {
      type: Number,
      default: 0,
    },
    answeredIncorrectly: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

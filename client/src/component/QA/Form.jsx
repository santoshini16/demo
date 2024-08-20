import React from "react";
import styles from "./QA.module.css";
import { deleteSVG } from "../../data/IconSvgs";
const Form = ({
  quizData,
  activeSlideIdx,
  handleQuestionChange,
  handleOptionTypeChange,
  handleAnswerChange,
  handleSetOptionType,
  handleAddOption,
  optionType,
  handleChangeOptionContentText,
  handleChangeOptionContentImageUrl,
  handleDeleteOption,
  handleTimeChange,
}) => {
  if (activeSlideIdx > quizData?.slides?.length) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputQuestion}>
        <input
          type="text"
          placeholder="Quiz question"
          className={styles.question}
          onChange={(e) => {
            handleQuestionChange(activeSlideIdx, e.target.value);
          }}
          value={quizData.slides[activeSlideIdx - 1].question}
        />
      </div>

      <div className={styles.optionType}>
        <span>Option Type</span>

        <div className={styles.optionTypeContent}>
          <input
            type="radio"
            name="optionType"
            id="text"
            style={{ width: "1rem", accentColor: "green" }}
            onChange={() => {
              handleSetOptionType("text");
              handleOptionTypeChange(activeSlideIdx, "text");
            }}
            checked={quizData.slides[activeSlideIdx - 1].optionType === "text"}
          />
          <label htmlFor="text">Text</label>
        </div>

        <div className={styles.optionTypeContent}>
          <input
            style={{ width: "1rem", accentColor: "green" }}
            type="radio"
            name="optionType"
            id="image"
            onChange={() => {
              handleSetOptionType("image");
              handleOptionTypeChange(activeSlideIdx, "image");
            }}
            checked={quizData.slides[activeSlideIdx - 1].optionType === "image"}
          />
          <label htmlFor="image">Image</label>
        </div>

        <div style={{ width: "1rem" }} className={styles.optionTypeContent}>
          <input
            type="radio"
            style={{ accentColor: "green" }}
            name="optionType"
            id="textImage"
            onChange={() => {
              handleSetOptionType("textImage");
              handleOptionTypeChange(activeSlideIdx, "textImage");
            }}
            checked={
              quizData.slides[activeSlideIdx - 1].optionType === "textImage"
            }
          />
          <label htmlFor="textImage" style={{ whiteSpace: "nowrap" }}>
            Text & Image
          </label>
        </div>
      </div>

      <div className={styles.answersContent}>
        {quizData.slides[activeSlideIdx - 1].options.map((option, i) => (
          <div className={styles.answers} key={i}>
            <input
              style={{ width: "1rem", accentColor: "green" }}
              type="radio"
              name="answer"
              id={i}
              onChange={() => {
                handleAnswerChange(activeSlideIdx, i + 1);
              }}
              checked={
                quizData.slides[activeSlideIdx - 1].correctAnswer === i + 1
              }
            />
            <input
              style={{
                backgroundColor:
                  quizData.slides[activeSlideIdx - 1].correctAnswer === i + 1 &&
                  "#60B84B",
                color:
                  quizData.slides[activeSlideIdx - 1].correctAnswer === i + 1 &&
                  "#ffffff",
              }}
              type="text"
              placeholder={optionType === "image" ? "imageUrl" : "text"}
              className={styles.answerInput}
              onChange={(e) =>
                handleChangeOptionContentText(activeSlideIdx, i, e.target.value)
              }
              value={quizData.slides[activeSlideIdx - 1].options[i].text}
            />
            {optionType === "textImage" && (
              <input
                style={{
                  backgroundColor:
                    quizData.slides[activeSlideIdx - 1].correctAnswer ===
                      i + 1 && "#60B84B",
                  color:
                    quizData.slides[activeSlideIdx - 1].correctAnswer ===
                      i + 1 && "white",
                }}
                type="text"
                placeholder="imageUrl"
                className={styles.answerInput}
                onChange={(e) =>
                  handleChangeOptionContentImageUrl(
                    activeSlideIdx,
                    i,
                    e.target.value
                  )
                }
                value={quizData.slides[activeSlideIdx - 1].options[i].imageUrl}
              />
            )}
            {quizData.slides[activeSlideIdx - 1].options.length > 2 && (
              <span onClick={() => handleDeleteOption(activeSlideIdx, i)}>
                {deleteSVG}
              </span>
            )}
          </div>
        ))}

        {quizData.slides[activeSlideIdx - 1].options?.length < 4 && (
          <div className={styles.answers}>
            <input
              style={{
                marginLeft: "2rem",
                cursor: "pointer",
                textAlign: "center",
              }}
              type="text"
              placeholder="Add Option"
              readOnly
              onClick={() => handleAddOption(activeSlideIdx)}
              className={styles.answerInput}
            />
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          right: "1.8rem",
        }}
      >
        <p
          style={{
            textAlign: "center",
            color: "gray",
            fontWeight: "500",
          }}
        >
          Timer
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <button
            onClick={() => handleTimeChange(0)}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 6px",
              borderRadius: "6px",
              backgroundColor:
                quizData.slides[activeSlideIdx - 1].timer === 0
                  ? "red"
                  : "white",
              border: "none",
              fontSize: "14px",
              padding: "0.2rem 1rem",
              color:
                quizData.slides[activeSlideIdx - 1].timer === 0
                  ? "white"
                  : "gray",
              cursor: "pointer",
              transitionDuration: 100,
            }}
          >
            OFF
          </button>
          <button
            onClick={() => handleTimeChange(5)}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 6px",
              borderRadius: "6px",
              backgroundColor:
                quizData.slides[activeSlideIdx - 1].timer === 5
                  ? "red"
                  : "white",
              border: "none",
              fontSize: "14px",
              padding: "0.2rem 1rem",
              color:
                quizData.slides[activeSlideIdx - 1].timer === 5
                  ? "white"
                  : "gray",
              cursor: "pointer",
              transitionDuration: 100,
            }}
          >
            5 sec
          </button>
          <button
            onClick={() => handleTimeChange(10)}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 6px",
              borderRadius: "6px",
              backgroundColor:
                quizData.slides[activeSlideIdx - 1].timer === 10
                  ? "red"
                  : "white",
              border: "none",
              fontSize: "14px",
              padding: "0.2rem 1rem",
              color:
                quizData.slides[activeSlideIdx - 1].timer === 10
                  ? "white"
                  : "gray",
              cursor: "pointer",
              transitionDuration: 100,
            }}
          >
            10 sec
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;

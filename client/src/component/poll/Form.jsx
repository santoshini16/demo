import React from "react";
import styles from "./poll.module.css";
import { deleteSVG } from "../../data/IconSvgs";

const Form = ({
  quizData,
  activeSlideIdx,
  handleQuestionChange,
  handleOptionTypeChange,
  handleSetOptionType,
  handleAddOption,
  optionType,
  handleChangeOptionContentText,
  handleChangeOptionContentImageUrl,
  handleDeleteOption,
}) => {
  if (activeSlideIdx > quizData?.slides?.length) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputQuestion}>
        <input
          type="text"
          placeholder="Poll question"
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
            type="radio"
            name="optionType"
            id="image"
            style={{ width: "1rem", accentColor: "green" }}
            onChange={() => {
              handleSetOptionType("image");
              handleOptionTypeChange(activeSlideIdx, "image");
            }}
            checked={quizData.slides[activeSlideIdx - 1].optionType === "image"}
          />
          <label htmlFor="image">Image</label>
        </div>
        <div className={styles.optionTypeContent} style={{ width: "1rem" }}>
          <input
            type="radio"
            name="optionType"
            id="textImage"
            style={{ accentColor: "green" }}
            onChange={() => {
              handleSetOptionType("textImage");
              handleOptionTypeChange(activeSlideIdx, "textImage");
            }}
            checked={quizData.slides[activeSlideIdx - 1].optionType === "textImage"}
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
              type="text"
              placeholder={optionType === "image" ? "imageUrl" : "text"}
              className={styles.answerInput}
              onChange={(e) =>
                handleChangeOptionContentText(activeSlideIdx, i, e.target.value)
              }
              value={quizData.slides[activeSlideIdx - 1].options[i].text}
              style={{ marginLeft: "2rem" }}
            />
            {optionType === "textImage" && (
              <input
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
              type="text"
              placeholder="Add Option"
              readOnly
              className={styles.answerInput}
              onClick={() => handleAddOption(activeSlideIdx)}
              style={{
                marginLeft: "2rem",
                cursor: "pointer",
                textAlign: "center",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;

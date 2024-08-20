import React, { useState } from "react";
import styles from "./QA.module.css";
import { Modal } from "@mantine/core";
import newRequest from "../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slide from "./Slide";
import Form from "./Form";

export const QA = ({
  openCreateQuizModal,
  setOpenCreateQuizModal,
  setShowComponent,
  quizName,
  quizType,
  setQuizId,
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(1);
  const [slideCount, setSlideCount] = useState(1);
  const [optionType, setOptionType] = useState("text");

  const [quizData, setQuizData] = useState({
    slides: [
      {
        question: "",
        optionType: optionType,
        timer: 0,
        quizType: "QA",
        options:
          optionType === "textImage"
            ? [
                { text: "", imageUrl: "" },
                { text: "", imageUrl: "" },
              ]
            : [{ text: "" }, { text: "" }],
        correctAnswer: 1,
      },
    ],
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSlide = () => {
    setSlideCount(slideCount + 1);
    setActiveSlideIdx(slideCount + 1);
    const newQuizData = { ...quizData };
    newQuizData.slides.push({
      question: "",
      optionType: newQuizData.slides[0].optionType,
      timer: newQuizData.slides[0].timer,
      quizType: "QA",
      options:
        optionType === "textImage"
          ? [
              { text: "", imageUrl: "" },
              { text: "", imageUrl: "" },
            ]
          : [{ text: "" }, { text: "" }],
      correctAnswer: 1,
    });
    setQuizData(newQuizData);
    if (slideCount >= 1) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleAddOption = (activeSlideIdx) => {
    const newQuizData = { ...quizData };
    newQuizData.slides[activeSlideIdx - 1].options.push(
      optionType === "textImage" ? { text: "", imageUrl: "" } : { text: "" }
    );
    setQuizData({ ...newQuizData });
  };

  const handleDeleteOption = (activeSlideIdx, optionIdx) => {
    if (quizData.slides[activeSlideIdx - 1]?.options?.length <= 1) {
      setShowError(true);
      setErrorMessage("You need to have at least 2 options");
      return;
    }

    const newQuizData = { ...quizData };
    newQuizData.slides[activeSlideIdx - 1].options.splice(optionIdx, 1);
    if (
      newQuizData.slides[activeSlideIdx - 1].correctAnswer >
      newQuizData.slides[activeSlideIdx - 1].options.length
    ) {
      newQuizData.slides[activeSlideIdx - 1].correctAnswer = 1;
    }
    setQuizData(newQuizData);
  };

  const handleSlideClick = (index) => {
    setActiveSlideIdx(index);
  };

  const handleQuestionChange = (index, value) => {
    const newQuizData = { ...quizData };
    newQuizData.slides[index - 1].question = value;
    setQuizData(newQuizData);
  };

  const handleChangeOptionContentText = (slideIdx, idx, value) => {
    const newQuizData = { ...quizData };
    newQuizData.slides[slideIdx - 1].options[idx].text = value;
    setQuizData(newQuizData);
  };

  const handleChangeOptionContentImageUrl = (slideIdx, idx, value) => {
    const newQuizData = { ...quizData };
    newQuizData.slides[slideIdx - 1].options[idx].imageUrl = value;
    setQuizData(newQuizData);
  };

  const handleAnswerChange = (index, value) => {
    const newQuizData = { ...quizData };
    newQuizData.slides[index - 1].correctAnswer = value;
    setQuizData(newQuizData);
  };

  const handleSetOptionType = (val) => {
    setOptionType(val);
  };

  const handleOptionTypeChange = (index, value) => {
    setOptionType(value);

    const newQuizData = { ...quizData };

    const modifiedPostData = newQuizData.slides.reduce((acc, obj) => {
      const modifiedObj = {
        ...obj,
        optionType: value,
        options:
          value === "textImage"
            ? [
                { text: "", imageUrl: "" },
                { text: "", imageUrl: "" },
              ]
            : [{ text: "" }, { text: "" }],
      };
      acc.push(modifiedObj);
      return acc;
    }, []);

    setQuizData({ slides: modifiedPostData });
    // setOptionType(() => newQuizData.slides[0].optionType);
  };

  const handleTimeChange = (value) => {
    const newQuizData = { ...quizData };

    const modifiedPostData = newQuizData.slides.reduce((acc, obj) => {
      const modifiedObj = {
        ...obj,
        timer: value,
      };
      acc.push(modifiedObj);
      return acc;
    }, []);

    setQuizData({ slides: modifiedPostData });
  };

  const handleDeleteSlide = (index) => {
    if (slideCount === 1) {
      setShowError(true);
      setErrorMessage("You need to have at least 1 question");
      return;
    }
    if (index === quizData.slides.length) {
      setActiveSlideIdx(index - 1);
    }

    const newQuizData = { ...quizData };
    newQuizData.slides.splice(index - 1, 1);

    if (index === activeSlideIdx) {
      setActiveSlideIdx(Math.max(index - 1, 1));
    } else if (index < activeSlideIdx) {
      setActiveSlideIdx(activeSlideIdx - 1);
    }

    setSlideCount(slideCount - 1);
    setQuizData(newQuizData);
  };

  // console.log("OptionType: " + optionType);
  // console.log(quizData);

  const [inProcess, setInProcess] = useState(false);

  const handleCreateQuiz = async (e) => {
    console.log("function create called")
    const token = localStorage.getItem("token");
    const error = quizData.slides.some(
      (slide) =>
        slide.correctAnswer === "" ||
        slide.optionType === "" ||
        slide.question === "" ||
        slide.quizType === "" ||
        slide.timer === "" ||
        slide.options.some((o) => o.text === "" || o.imageUrl === "")
    );

    if (slideCount < 1) {
      setShowError(true);
      setErrorMessage("You need to have atleast 1 question.");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields.");
      return;
    }

    setShowError(false);
    setErrorMessage("");

    setInProcess(true);
    try {
      const dataToSend = {
        quizName: quizName,
        timer: quizData.slides[0].timer,
        quizType: "QA",
        optionType: optionType,
        questions: quizData.slides,
      };

      // console.log(dataToSend);

      const res = await newRequest.post(`/api/create`, dataToSend,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setQuizId(res?.data?._id); 

      toast.success(res?.data?.message,{
        autoClose: 3000, // Adjust the time if needed
        pauseOnHover: true,
        onClose: () => {
          console.log("Toast closed"); // Debug to see if there's an issue on close
        },
      });
      setShowComponent(2);
    } catch (error) {
      setShowError(true);
      console.log(error);
      setErrorMessage("Something went wrong!");
    } finally {
      setInProcess(false);
    }

    // console.log(quizData);
  };

  return (
    <Modal
      opened={openCreateQuizModal}
      onClose={() => setOpenCreateQuizModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
      size="lg"
      className={styles.modal_typo}
    >
      <div className={styles.slideForm}>
        <Slide
          slideCount={slideCount}
          activeSlideIdx={activeSlideIdx}
          handleSlideClick={handleSlideClick}
          handleAddSlide={handleAddSlide}
          handleDeleteSlide={handleDeleteSlide}
        />
        <Form
          quizData={quizData}
          activeSlideIdx={activeSlideIdx}
          handleQuestionChange={handleQuestionChange}
          handleOptionTypeChange={handleOptionTypeChange}
          handleAnswerChange={handleAnswerChange}
          handleSetOptionType={handleSetOptionType}
          handleAddOption={handleAddOption}
          optionType={optionType}
          handleChangeOptionContentText={handleChangeOptionContentText}
          handleChangeOptionContentImageUrl={handleChangeOptionContentImageUrl}
          handleDeleteOption={handleDeleteOption}
          handleTimeChange={handleTimeChange}
        />
      </div>

      {showError && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.btns}>
        <button
          onClick={() => setOpenCreateQuizModal(false)}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateQuiz}
          disabled={inProcess}
          className={styles.createQuizBtn}
        >
          Create Quiz
        </button>
      </div>
    </Modal>
  );
};
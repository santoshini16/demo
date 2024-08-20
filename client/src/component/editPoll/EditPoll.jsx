import React, { useEffect, useState } from "react";
import styles from "./EditPoll.module.css";
import { Modal } from "@mantine/core";
import newRequest from "../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slide from "../poll/Slide";
import Form from "../poll/Form";



export const EditPoll = ({ openEditQuizModal, setOpenEditQuizModal, quId }) => {
  const [allQuizData, setAllQuizData] = useState({});
  const [allQuestionsData, setAllQuestionsData] = useState([]);

  useEffect(() => {
    const fetchD = async () => {
      try {
        const res = await newRequest.get(`api/quizzes/${quId}`);
        setAllQuizData(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchD();
  }, [quId]);

  useEffect(() => {
    const fetchD = async () => {
      try {
        const res = await newRequest.get(`api/quizzes/questions/${quId}`);
        setAllQuestionsData(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchD();
  }, [quId]);

  const [activeSlideIdx, setActiveSlideIdx] = useState(1);
  const [slideCount, setSlideCount] = useState(allQuestionsData?.length);

  useEffect(() => {
    setSlideCount(allQuestionsData?.length);
    setQuizData({ slides: allQuestionsData });
  }, [allQuestionsData, allQuizData]);

  const [optionType, setOptionType] = useState("text");

  const [quizData, setQuizData] = useState({
    slides: allQuestionsData,
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

  const [inProcess, setInProcess] = useState(false);

  const handleUpdateQuiz = async () => {
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
        timer: 0,
        optionType: optionType,
        questions: quizData.slides,
      };

      await newRequest.put(`api/quiz/${quId}`, dataToSend,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Poll updated successfully!");
      setOpenEditQuizModal(false);
    } catch (error) {
      setShowError(true);
      console.log(error);
      setErrorMessage("Something went wrong!");
    } finally {
      setInProcess(false);
      setOpenEditQuizModal(false);
    }
  };

  return (
    <Modal
      opened={openEditQuizModal}
      onClose={() => setOpenEditQuizModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
      size="lg"
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
          handleSetOptionType={handleSetOptionType}
          handleAddOption={handleAddOption}
          optionType={optionType}
          handleChangeOptionContentText={handleChangeOptionContentText}
          handleChangeOptionContentImageUrl={handleChangeOptionContentImageUrl}
          handleDeleteOption={handleDeleteOption}
        />
      </div>

      {showError && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.btns}>
        <button
          onClick={() => setOpenEditQuizModal(false)}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateQuiz}
          disabled={inProcess}
          className={styles.createQuizBtn}
        >
          Update Poll
        </button>
      </div>
    </Modal>
  );
};
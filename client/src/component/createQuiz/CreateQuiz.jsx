import React, { useState } from "react";
import { Modal } from "@mantine/core";
import styles from "./CreateQuiz.module.css";
import { QA } from "../QA/QA";
import { Poll } from "../poll/Poll";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CreateQuiz = ({ openCreateQuizModal, setOpenCreateQuizModal }) => {
  // 0 means Q&A, 1 means Poll
  const [quizType, setQuizType] = useState(0);

  // 0 means Quiz1, 1 means QA/Poll, 2 means quizCreated
  const [showComponent, setShowComponent] = useState(0);

  const [quizName, setQuizName] = useState("");
  const [quizId, setQuizId] = useState(""); // Initially an empty string

  const [err, seterr] = useState("");

  const handleContinueToQuiz1 = () => {
    seterr("");

    if (!quizName) {
      seterr("Quiz Name is required!");
      return;
    }
    setShowComponent(1);
  };

  return (
    <Modal
      opened={openCreateQuizModal}
      onClose={() => setOpenCreateQuizModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
      size="lg"
    >
      {showComponent === 0 && (
        <Quiz1
          quizType={quizType}
          setQuizType={setQuizType}
          setOpenCreateQuizModal={setOpenCreateQuizModal}
          setShowComponent={setShowComponent}
          setQuizName={setQuizName}
          handleContinueToQuiz1={handleContinueToQuiz1}
          err={err}
        />
      )}

      {showComponent === 1 &&
        (quizType === 0 ? (
          <QA
            openCreateQuizModal={openCreateQuizModal}
            setOpenCreateQuizModal={setOpenCreateQuizModal}
            setShowComponent={setShowComponent}
            quizName={quizName}
            quizType="QA"
            setQuizId={setQuizId} // Ensure this sets quizId from API response
          />
        ) : (
          <Poll
            openCreateQuizModal={openCreateQuizModal}
            setOpenCreateQuizModal={setOpenCreateQuizModal}
            setShowComponent={setShowComponent}
            quizName={quizName}
            quizType="POLL"
            setQuizId={setQuizId} // Ensure this sets quizId from API response
          />
        ))}

      {showComponent === 2 && (
        <QuizCreated quizType={quizType} quizId={quizId} />
      )}
    </Modal>
  );
};

const Quiz1 = ({
  quizType,
  setQuizType,
  setOpenCreateQuizModal,
  setShowComponent,
  setQuizName,
  handleContinueToQuiz1,
  err,
}) => {
  return (
    <div className={styles.modal}>
      <input
        type="text"
        placeholder={err ? err : "Quiz Name"}
        className={styles.quizNameInput}
        onChange={(e) => setQuizName(e.target.value)}
        style={{ border: err ? "1px solid red" : "1px solid transparent" }}
      />

      <div className={styles.content}>
        <label htmlFor="quizType">Quiz Type </label>
        <button
          onClick={() => setQuizType(0)}
          className={`${styles.optionToSelect} ${
            quizType === 0 && styles.selected
          }`}
        >
          Q & A
        </button>
        <button
          onClick={() => setQuizType(1)}
          className={`${styles.optionToSelect} ${
            quizType === 1 && styles.selected
          }`}
        >
          Poll Type
        </button>
      </div>

      <div className={styles.btns}>
        <button
          onClick={() => setOpenCreateQuizModal(false)}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button onClick={handleContinueToQuiz1} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  );
};

const QuizCreated = ({ quizType, quizId }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5173";
  console.log(import.meta.env.VITE_BASE_URL)
  
  const localUrl = `${baseUrl}/playquiz/${quizId}`; // Use local URL for now

  const shareQuiz = () => {
    if (quizId) {
      navigator.clipboard.writeText(localUrl); // Copy the local URL to clipboard
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Quiz ID is not available.");
    }
  };

  return (
    <div className={styles.modal}>
      <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "600" }}>
        <p>Congrats your {quizType === 0 ? "Quiz" : "Poll"} is</p>
        <p>Published</p>
      </div>

      {quizId ? (
        <>
          <input
            type="text"
            placeholder={`Your ${quizType === 0 ? "quiz" : "poll"} link is here`}
            className={styles.quizNameInput}
            readOnly
            value={localUrl} // Display the local URL
          />
          <div className={styles.shareBtnDiv}>
            <button className={styles.shareBtn} onClick={shareQuiz}>
              Share
            </button>
          </div>
        </>
      ) : (
        <p>Quiz ID not available. Please try again.</p>
      )}
    </div>
  );
};

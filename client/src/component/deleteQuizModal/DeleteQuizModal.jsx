import React from "react";
import styles from "./DeleteQuizModal.module.css";
import { Modal } from "@mantine/core";
import newRequest from "../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const DeleteQuizModal = ({
  openDeleteQuizModal,
  setOpenDeleteQuizModal,
  quId,
}) => {
  const handleDeleteQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await newRequest.delete(`api/quiz/${quId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res?.data?.message,{
        autoClose: 3000, // Adjust the time if needed
        pauseOnHover: true,
        onClose: () => {
          console.log("Toast closed"); // Debug to see if there's an issue on close
        },
      });
      setOpenDeleteQuizModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      opened={openDeleteQuizModal}
      onClose={() => setOpenDeleteQuizModal(false)}
      closeOnClickOutside
      withCloseButton={false}
      centered
      size="lg"
      padding={"1.5rem"}
    >
      <div>
        <p className={styles.heading}>
          Are you confirm you <br />
          want to delete?
        </p>

        <div className={styles.btns}>
          <button
            type="button"
            onClick={handleDeleteQuiz}
            className={styles.cancelBtn}
          >
            Confirm Delete
          </button>
          <button
            onClick={() => setOpenDeleteQuizModal(false)}
            className={styles.continueBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CreateQuiz } from "../createQuiz/CreateQuiz";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [openCreateQuizModal, setOpenCreateQuizModal] = useState(false);


  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      // const res = await newRequest.get(`auth/logout`);
  
      // Remove token and other user-related data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
  
      // Show success message
      toast.success("user logout successfully");
  
      // Navigate back to home or login page
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>QUIZZIE</h1>

      <div className={styles.content}>
        <Link to={`/dashboard`} className={styles.link}>
          <h5
            className={`${styles.contentTitle} ${
              pathname === "/dashboard" && styles.selected
            }`}
          >
            Dashboard
          </h5>
        </Link>
        <Link to={`/analytics`} className={styles.link}>
          <h5
            className={`${styles.contentTitle} ${
              (pathname === "/analytics" ||
                pathname.split("/")[3] === "questionWise") &&
              styles.selected
            }`}
          >
            Analytics
          </h5>
        </Link>
        <h5
          className={styles.contentTitle}
          onClick={() => setOpenCreateQuizModal(true)}
        >
          Create Quiz
        </h5>
        {openCreateQuizModal && (
          <CreateQuiz
            openCreateQuizModal={openCreateQuizModal}
            setOpenCreateQuizModal={setOpenCreateQuizModal}
          />
        )}
      </div>

      <button onClick={logoutUser} className={styles.logout}>
        LOGOUT
      </button>
      <ToastContainer/>
    </div>
  );
};
export default Sidebar;
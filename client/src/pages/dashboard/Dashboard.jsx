import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { QuizzesComp } from "../../component/quizzesComp/QuizzesComp";
import newRequest from "../../utils/newRequest";
import { useSelector } from "react-redux";
import convertToK from "../../utils/convertToK";
import Sidebar from "../../component/sidebar/Sidebar";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const { currentUser } = useSelector((state) => state.auth); 

  useEffect(() => {
    const fetchD = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await newRequest.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) {
      fetchD();
    }
  }, [currentUser]);

  const [loading, setLoading] = useState(false);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);

  useEffect(() => {
    const fetchTrendingQuizzes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await newRequest.get(`api/trending`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrendingQuizzes(res?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchTrendingQuizzes();
    }
  }, [currentUser]);

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          flex: 1,
          position: "fixed",
          top: 0,
          backgroundColor: "white",
        }}
      >
        <Sidebar/>
      </div>
      <div style={{ flex: 5, marginLeft: "13rem" }}>
        <div className={styles.dashboard}>
          <div className={styles.mainContent}>
            <div className={styles.singleContent} style={{ color: "orange" }}>
              <p className={styles.heading}>
                <span>{dashboardData.totalQuizzesCreatedByUser} </span> Quiz
              </p>
              <p className={styles.para}>Created</p>
            </div>

            <div className={styles.singleContent} style={{ color: "green" }}>
              <p className={styles.heading}>
                <span>{dashboardData?.totalQuestionCreatedByUser} </span>Questions
              </p>
              <p className={styles.para}>Created</p>
            </div>

            <div className={styles.singleContent} style={{ color: "blue" }}>
              <p className={styles.heading}>
                <span>{convertToK(dashboardData?.totalImpressions)} </span> Total
              </p>
              <p className={styles.para}>Impressions</p>
            </div>
          </div>

          <h6 style={{ margin: "4rem 0 3rem 0", fontSize: "2rem" }}>
            Trending Quizzes
          </h6>

          <div className={styles.quizzesComp}>
            {loading ? (
              <div style={{ textAlign: "center" }}>Loading...</div>
            ) : trendingQuizzes?.length === 0 ? (
              <div style={{ color: "#123456" }}>No trending quizzes!</div>
            ) : (
              trendingQuizzes?.map((trendingQuiz) => (
                <QuizzesComp key={trendingQuiz?._id} quizData={trendingQuiz} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

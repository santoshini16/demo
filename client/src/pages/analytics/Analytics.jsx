import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import newRequest from "../../utils/newRequest";
import { useSelector } from "react-redux";
import { LoadingSVG } from "../../data/IconSvgs";
import MyFunction from "../../component/MyFunction";
import Sidebar from "../../component/sidebar/Sidebar"

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  const { currentUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await newRequest.get(`api/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnalyticsData(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Callback to handle successful quiz deletion
  const handleDeleteSuccess = (deletedQuizId) => {
    setAnalyticsData(prevData => prevData.filter(quiz => quiz._id !== deletedQuizId));
  };

  return (
    <div className={styles.layout}>
      <Sidebar/>
      <div className={styles.analytics}>
      <h2 className={styles.heading}>Quiz Analysis</h2>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr style={{ borderRadius: "80px" }}>
              <th className={styles.headTH}>S.No</th>
              <th className={styles.headTH}>Quiz Name</th>
              <th className={styles.headTH}>Created On</th>
              <th className={styles.headTH}>Impression</th>
              <th className={styles.headTH}></th>
              <th className={styles.headTH}></th>
            </tr>
          </thead>

          <tbody>
            {analyticsData?.map((analytic, i) => (
              <MyFunction
                analytic={analytic}
                i={i}
                key={analytic._id}
                onDeleteSuccess={handleDeleteSuccess} // Pass the callback here
              />
            ))}
          </tbody>
        </table>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {LoadingSVG}
          </div>
        ) : (
          analyticsData.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              No data to show!
            </div>
          )
        )}
      </div>
    </div>
    </div>
  );
};

export default Analytics;


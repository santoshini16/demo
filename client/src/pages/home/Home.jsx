import React from "react";
import styles from "./home.module.css";
import { Register } from "../../component/register/Register";
import { Login } from "../../component/login/Login";
import { useAuthComp } from "../../context/AuthComp";

const Home = () => {
  // 0=signup, 1=login
  const { activeAuthComp, setActiveAuthComp } = useAuthComp();

  return (
    <div className={styles.container}>
      <div className={styles.auth_container}>
        <h1>QUIZZIE</h1>

        <div className={styles.activeComp}>
          <button
            onClick={() => setActiveAuthComp(0)}
            className={`${styles.register} ${
              JSON.parse(activeAuthComp) === 0 && styles.activeState
            }`}
          >
            Signup
          </button>
          <button
            onClick={() => setActiveAuthComp(1)}
            className={`${styles.login} ${
              JSON.parse(activeAuthComp) === 1 && styles.activeState
            }`}
          >
            Login
          </button>
        </div>

        <div className={styles.m}>
          {JSON.parse(activeAuthComp) === 0 ? (
            <Register setActiveAuthComp={setActiveAuthComp} />
          ) : (
            <Login />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
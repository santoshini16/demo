import React from "react";
import styles from "./Home.module.css";
import { Register } from "../../component/register/Register";
import { Login } from "../../component/login/Login";
import { useAuthComp } from "../../context/AuthComp";

const Home = () => {
  // 0=signup, 1=login
  const { activeAuthComp, setActiveAuthComp } = useAuthComp();

  return (
    <div className={styles.container}>
      <div className={styles.comp_container}>
        <h1 className={styles.title}>QUIZZIE</h1>

        <div className={styles.activeAuth}>
          <button
            onClick={() => setActiveAuthComp(0)}
            className={`${styles.register} ${
              JSON.parse(activeAuthComp) === 0 && styles.activeState
            } ${styles.typography}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveAuthComp(1)}
            className={`${styles.login} ${
              JSON.parse(activeAuthComp) === 1 && styles.activeState
            } ${styles.typography}`}
          >
            Log In
          </button>
        </div>

        <div className={styles.toggle_comp}>
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
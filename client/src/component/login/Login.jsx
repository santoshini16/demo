import React, { useState } from "react";
import styles from "../register/Register.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated,setCurrentUser } from "../../configureSlice/reduxSlice";
import newRequest from "../../utils/newRequest";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState({
    emailErr: "",
    passwordErr: "",
  });

  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    const error = {};
    setError(error);

    setErrorResponse("");

    if (!email) {
      error.emailErr = "Email is required!";
    }

    if (!password) {
      error.passwordErr = "Password is required!";
      return;
    }

    try {
      // dispatch(loginStart());
      setLoading(true);
      const res = await newRequest.post("user/login", {
        email,
        password,
      });

      const { token, userId, username } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      dispatch(setCurrentUser({ userId, username }));
      dispatch(setIsAuthenticated(true));
      toast.success("Logged in successfully!");
      navigate("/");
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setErrorResponse(error?.response?.data?.message);
      setLoading(false);
      // dispatch(loginFailure());
    }
  };

  // console.log(errorResponse);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={loginUser}>
        <div className={styles.form_input}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder={error.emailErr ? error.emailErr : ""}
            name="email"
            autoComplete="off"
            className={styles.inputField}
            onChange={(e) => setEmail(e.target.value)}
           
          />
          
        </div>

        <div className={styles.form_input}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder={error.passwordErr ? error.passwordErr : ""}
            name="password"
            autoComplete="off"
            className={styles.inputField}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "center", fontSize: "14px", color: "red" }}>
          {errorResponse}
        </div>

        <div className={styles.loginBtnDiv}>
          <button disabled={loading} type="submit" className={styles.btn}>
            {loading ? "loading..." : "Login"}
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};
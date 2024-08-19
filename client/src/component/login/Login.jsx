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
      setLoading(true);
      const res = await newRequest.post("user/login", {
        email,
        password,
      });
  
      // Log the response to check if data is received correctly
      console.log("Response data: ", res.data);
  
      const { token, userId, username } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
  
      // Dispatch actions to update Redux state
      dispatch(setCurrentUser({ userId, username,token }));
      dispatch(setIsAuthenticated(true));
  
      // Log before navigating
      console.log("Navigating to dashboard");
      toast.success("Logged in successfully!");
      navigate("/dashboard");
      
      setLoading(false);
    } catch (error) {
      setErrorResponse(error?.response?.data?.message);
      setLoading(false);
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
            className={`${styles.inputField} ${
              error.emailErr ? styles.error : ""
            }`}
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
            className={`${styles.inputField} ${
              error.passwordErr ? styles.error : ""
            }`}
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
import React, { useState } from "react";
import styles from "./Register.module.css";
import newRequest from "../../utils/newRequest";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = ({ setActiveAuthComp }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    nameErr: "",
    emailErr: "",
    passwordErr: "",
    confirmPasswordErr: "",
  });
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.nameErr = "Invalid name";
    }

    if (!email) {
      newErrors.emailErr = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.emailErr = "Invalid Email";
    }

    if (!password) {
      newErrors.passwordErr = "Password is required";
    } else if (password.length < 6) {
      newErrors.passwordErr = "Weak Password";
    }

    if (!confirmPassword) {
      newErrors.confirmPasswordErr = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPasswordErr = "Passwords don't match";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await newRequest.post("user/register", {
        name: username,
        email,
        password,
      });

      toast.success("User created successfully");
      setTimeout(() => {
        setActiveAuthComp(1);  // Adding a delay before switching components
      }, 1000); 
      setLoading(false);
    } catch (error) {
      setErrorResponse(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={registerUser}>
        {/* Name Input */}
        <div className={styles.form_input}>
          <label htmlFor="username" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="username"
            placeholder={error.nameErr ? error.nameErr : ""}
            name="username"
            autoComplete="off"
            className={`${styles.inputField} ${
              error.nameErr ? styles.error : ""
            }`}
            onChange={(e) => setUsername(e.target.value)}
            value={username} 
          />
        </div>

        {/* Email Input */}
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
            value={email} 
          />
        </div>

        {/* Password Input */}
        <div className={styles.form_input}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder={
              error.passwordErr ? error.passwordErr : ""
            }
            name="password"
            autoComplete="off"
            className={`${styles.inputField} ${
              error.passwordErr ? styles.error : ""
            }`}
            onChange={(e) => setPassword(e.target.value)}
            value={password} 
          />
        </div>

        {/* Confirm Password Input */}
        <div className={styles.form_input}>
          <label htmlFor="confirm_password" className={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            placeholder={
              error.confirmPasswordErr
                ? error.confirmPasswordErr
                : ""
            }
            name="confirm_password"
            autoComplete="off"
            className={`${styles.inputField} ${
              error.confirmPasswordErr ? styles.error : ""
            }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword} 
          />
        </div>

        {/* Error Response */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "red" }}>
          {errorResponse}
        </div>

        {/* Submit Button */}
        <div className={styles.registerBtnDiv}>
          <button disabled={loading} type="submit" className={styles.btn}>
            {loading ? "loading..." : "Sign-Up"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};








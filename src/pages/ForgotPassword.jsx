import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import Button from "../components/Button/Button";
import styles from "./ForgotPassword.module.css";
import Input from "../components/Input/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await forgotPassword(email);

      setStatus("success");
      setMessage(response.data.message || "Email sent! Check your inbox.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {/* Feedback Message */}
        {message && (
          <div
            className={`${styles.alert} ${
              status === "success" ? styles.success : styles.error
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={status === "loading"}
            style={{ width: "100%" }}
          >
            {status === "loading" ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Remember your password? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

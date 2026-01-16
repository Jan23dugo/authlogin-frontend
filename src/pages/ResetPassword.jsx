import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/api";
import Button from "../components/Button/Button";
import styles from "./ResetPassword.module.css";
import Input from "../components/Input/Input";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await resetPassword(token, password, confirmPassword);

      setStatus("success");
      setMessage(response.data.message || "Password reset successful!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Link expired or invalid. Please try again."
      );
    }
  };

  // If success, show success view
  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 style={{ color: "green" }}>Success!</h2>
          <p>{message}</p>
          <p>Redirecting to login...</p>
          <Button onClick={() => navigate("/login")}>Go to Login Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Reset Password</h2>
        <p className={styles.subtitle}>Enter your new password below.</p>

        {/* Error Message */}
        {status === "error" && (
          <div className={`${styles.alert} ${styles.error}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <Input
              label="New Password"
              type="password"
              id="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={status === "loading"}
            style={{ width: "100%" }}
          >
            {status === "loading" ? "Resetting..." : "Set New Password"}
          </Button>
        </form>

        {/* Link back if the token is invalid/expired so they can request a new one */}
        {status === "error" && (
          <div className={styles.footer}>
            <p>
              <Link to="/forgot-password">Request a new link</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

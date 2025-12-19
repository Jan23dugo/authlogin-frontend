import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Invalid verification link."
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await API.post("/verify-email", { token });

        setStatus("success");
        setMessage("Your email has been successfully verified.");

        setTimeout(() => {
          navigate("/login?verified=true");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed or the link has expired."
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className={styles.VerifyEmail}>
      {status === "loading" && (
        <>
          <h1>Verifying your email...</h1>
          <p>Please wait.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h1>✅ Email Verified</h1>
          <p>{message}</p>
          <p>Redirecting to login...</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>❌ Verification Failed</h1>
          <p>{message}</p>
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import styles from "./VerifyEmail.module.css";
import Button from "../components/Button/Button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasCalledAPI = useRef(false);

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Invalid verification link.");

  useEffect(() => {
    if (!token || hasCalledAPI.current) return;

    const verify = async () => {
      hasCalledAPI.current = true;
      try {
        await API.post("/verify-email", { token });
        setStatus("success");
        setMessage("Your email has been successfully verified.");
        setTimeout(() => navigate("/login?verified=true"), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed or the link has expired.");
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
          {/* 2. Use your Button component here */}
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>❌ Verification Failed</h1>
          <p>{message}</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
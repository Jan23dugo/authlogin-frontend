import { useState, useEffect, useRef, startTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../services/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import FormError from "../components/FormError/FormError";
import FormSuccess from "../components/FormSuccess/FormSuccess";
import styles from "./Login.module.css";
import AuthSwitchText from "../components/AuthSwitchText/AuthSwitchText";
import AuthLink from "../components/AuthLink/AuthLink";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasProcessedParams = useRef(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "", // Store 2FA code here
  });

  const [isTwoFactor, setIsTwoFactor] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (hasProcessedParams.current) return;

    const verified = searchParams.get("verified");
    const registered = searchParams.get("registered");
    const errorParam = searchParams.get("error");

    if (verified === "true" || registered === "true" || errorParam) {
      hasProcessedParams.current = true;

      startTransition(() => {
        if (verified === "true") {
          setSuccess("Email verified successfully! You can now log in.");
        }
        if (registered === "true") {
          setSuccess(
            "Registration successful! Please check your email to verify your account before logging in.",
          );
        }
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
        }
        setSearchParams({});
      });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (e) => {
    // Limit 2FA code to 6 digits numbers only
    if (e.target.name === "code") {
      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
      setFormData({ ...formData, code: val });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        code: formData.code,
      });

      if (response.data.isTwoFactorEnabled) {
        setIsTwoFactor(true); 
        setSuccess("Please enter the code from your Authenticator App.");
        return; 
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login Failed";
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.login}>
      <h1>{isTwoFactor ? "Two-Factor Auth" : "Login"}</h1>

      <FormSuccess message={success} />
      <FormError message={error} />

      <form onSubmit={handleLogin}>
        {!isTwoFactor && (
          <>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {isTwoFactor && (
          <Input
            label="Authentication Code"
            placeholder="123456"
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            autoFocus
          />
        )}

        <Button type="submit">
          {isTwoFactor ? "Verify & Login" : "Login"}
        </Button>
      </form>

      {!isTwoFactor && (
        <>
          <AuthLink to="/forgot-password" align="right">
            Forgot Password?
          </AuthLink>

          <AuthSwitchText
            text="Don't have an account?"
            linkText="Register"
            to="/register"
          />
        </>
      )}

      {isTwoFactor && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span
            style={{ cursor: "pointer", color: "#666", fontSize: "0.9rem" }}
            onClick={() => setIsTwoFactor(false)}
          >
            Back to Login
          </span>
        </div>
      )}
    </div>
  );
};

export default Login;

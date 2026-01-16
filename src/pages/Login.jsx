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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for verification success, registration, or error from URL params
  useEffect(() => {
    if (hasProcessedParams.current) return;

    const verified = searchParams.get("verified");
    const registered = searchParams.get("registered");
    const errorParam = searchParams.get("error");

    if (verified === "true" || registered === "true" || errorParam) {
      hasProcessedParams.current = true;

      // Use startTransition to mark state updates as non-urgent and avoid cascading renders
      startTransition(() => {
        if (verified === "true") {
          setSuccess("Email verified successfully! You can now log in.");
        }
        if (registered === "true") {
          setSuccess(
            "Registration successful! Please check your email to verify your account before logging in."
          );
        }
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
        }
        // Clear the query params
        setSearchParams({});
      });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Save token to local storage
      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect user
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login Failed";
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.login}>
      <h1>Login</h1>

      <FormSuccess message={success} />
      <FormError message={error} />

      <form onSubmit={handleLogin}>
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

        <Button type="submit">Login</Button>
      </form>

      <AuthLink to="/forgot-password" align="right">
        Forgot Password?
      </AuthLink>

      <AuthSwitchText
        text="Don't have an account?"
        linkText="Register"
        to="/register"
      />
    </div>
  );
};

export default Login;

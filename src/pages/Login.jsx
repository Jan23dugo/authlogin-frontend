import { useState, useEffect, useRef, startTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../services/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import FormError from "../components/FormError/FormError";
import FormSuccess from "../components/FormSuccess/FormSuccess";
import styles from "./Login.module.css";

function Login() {
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
          setSuccess("Registration successful! Please check your email to verify your account before logging in.");
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

      <p style={{ marginTop: "10px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;

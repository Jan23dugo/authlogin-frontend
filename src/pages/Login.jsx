import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import FormError from "../components/FormError/FormError";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
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
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className={styles.login}>
      <h1>Login</h1>

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

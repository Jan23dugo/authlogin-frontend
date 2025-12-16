import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import FormError from "../components/FormError/FormError";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className={styles.register}>
      <h1>Register</h1>

      <FormError message={error} />
      <form onSubmit={handleRegister}>
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="middleName"
          placeholder="Middle Name"
          value={formData.middleName}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit">Register</Button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;

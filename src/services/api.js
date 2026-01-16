import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1/users",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = async (data) => {
  return API.post("/login", data);
};

export const registerUser = async (data) => {
  return API.post("/register", data);
};

// Email verification service
export const verifyEmail = async (token) => {
  return API.post("/verify-email", { token });
};

export const forgotPassword = async (email) => {
  return API.post("/forgot-password", { email });
};

export const resetPassword = async (token, password, confirmPassword) => {
  return API.put(`/reset-password/${token}`, { password, confirmPassword });
};

export default API;

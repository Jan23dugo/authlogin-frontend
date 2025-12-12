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

export default API;

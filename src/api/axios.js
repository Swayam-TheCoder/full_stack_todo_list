import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

// https://todo-backend-n4tc.onrender.com/api
import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-backend-n4tc.onrender.com/api",
  withCredentials: true,
});

export default api;

// https://todo-backend-n4tc.onrender.com/api
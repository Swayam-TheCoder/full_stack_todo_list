// src/api/todos.api.js
import api from "./axios";

export const getTodos = async (userId) => {
  if (!userId) return []; // 🔥 critical guard
  const res = await api.get(`/todos?userId=${userId}`);
  return res.data; // MUST be array
};

export const createTodo = async (todo) => {
  const res = await api.post("/todos", todo);
  return res.data;
};

export const updateTodo = async (todo) => {
  const res = await api.put(`/todos/${todo._id}`, todo);
  return res.data;
};

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`);
};
import api from "./axios";

// TEMP: localStorage fallback
export const getTodos = async () => {
  const data = localStorage.getItem("todos");
  return data ? JSON.parse(data) : [];
};

export const createTodo = async (todo) => {
  const todos = await getTodos();
  const updated = [...todos, todo];
  localStorage.setItem("todos", JSON.stringify(updated));
  return updated;
};

export const updateTodo = async (updatedTodo) => {
  const todos = await getTodos();
  const updated = todos.map((t) =>
    t.id === updatedTodo.id ? updatedTodo : t
  );
  localStorage.setItem("todos", JSON.stringify(updated));
  return updated;
};

export const deleteTodo = async (id) => {
  const todos = await getTodos();
  const updated = todos.filter((t) => t.id !== id);
  localStorage.setItem("todos", JSON.stringify(updated));
  return updated;
};
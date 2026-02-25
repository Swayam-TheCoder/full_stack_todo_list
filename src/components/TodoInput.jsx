import { useState } from "react";

const TodoInput = ({ addTodo }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // 🔥 prevent empty title

    addTodo(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 input"
      />
      <button className="btn-primary">Add</button>
    </form>
  );
};

export default TodoInput;
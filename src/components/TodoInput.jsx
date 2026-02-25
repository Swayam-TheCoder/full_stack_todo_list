import { useState } from "react";

const TodoInput = ({ addTodo }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mt-6 mb-7">
  <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="✨ What’s your next mission?"
    className="input text-lg"
  />
  <button className="btn-primary neon">Add</button>
</form>
  );
};

export default TodoInput;
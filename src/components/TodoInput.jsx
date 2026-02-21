import { useState } from "react";

function TodoInput({ addTodo }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo(title);
    setTitle("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-transparent outline-none dark:text-white"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded
                   hover:bg-blue-700 transition"
      >
        Add
        
      </button>
    </form>
  );
}

export default TodoInput;
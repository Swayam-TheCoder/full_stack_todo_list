import { useState } from "react";
import { GripVertical } from "lucide-react";

function TodoCard({ todo, deleteTodo, toggleTodo, editTodo, dragHandleProps }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  function handleEdit() {
    if (!newTitle.trim()) return;
    editTodo(todo.id, newTitle);
    setIsEditing(false);
  }

  return (
    <div
      className={`relative rounded-2xl p-6 m-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 ${
        todo.completed ? "opacity-70" : ""
      }`}
    >
      {/* Drag */}
      <span
        {...dragHandleProps}
        className="absolute top-4 right-4 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical size={18} />
      </span>

      {/* Title */}
      {isEditing ? (
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      ) : (
        <h3
          className={`text-lg font-semibold mb-4 ${
            todo.completed
              ? "line-through text-gray-400"
              : "dark:text-white"
          }`}
        >
          {todo.title}
        </h3>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => toggleTodo(todo._id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            todo.completed
              ? "bg-green-500/10 text-green-600"
              : "bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {todo.completed ? "Completed" : "Pending"}
        </button>

        <div className="flex items-center gap-3 text-sm">
          {isEditing ? (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:underline"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => deleteTodo(todo._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>

          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo._id)}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
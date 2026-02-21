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
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
      {isEditing ? (
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-3"
        />
      ) : (
        <div className="flex justify-between items-start">
          <h3
            className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400" : "dark:text-white"}`}
          >
            {todo.title}
          </h3>

          <span
            {...dragHandleProps}
            className="cursor-grab text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={18} />
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`text-sm px-3 py-1 rounded-full ${
            todo.completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {todo.completed ? "Completed" : "Pending"}
        </button>

        <div className="flex gap-3 text-sm">
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
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoCard;

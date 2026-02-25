import { useEffect, useState, useCallback } from "react";
import TodoInput from "../components/TodoInput";
import TodoCard from "../components/TodoCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todos.api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [filter, setFilter] = useState(
    () => localStorage.getItem("filter") || "all",
  );

  const { user } = useAuth();

  /* ---------------- LOAD TODOS ---------------- */
  useEffect(() => {
  if (!user || !user._id) return;

  const loadTodos = async () => {
    try {
      const data = await getTodos(user._id);
      setTodos(data);
    } catch (err) {
      toast.error("Failed to load todos",err);
    }
  };

  loadTodos();
}, [user]);

  /* ---------------- FILTER PERSIST ---------------- */
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  /* ---------------- STATE UPDATE HELPER ---------------- */
  const updateTodos = useCallback(
    (newTodos) => {
      const safe = Array.isArray(newTodos) ? newTodos : [];

      if (filter === "all") {
        setHistory((prev) => [...prev, todos]);
        setFuture([]);
      }
      setTodos(safe);
    },
    [todos, filter],
  );

  /* ---------------- UNDO / REDO ---------------- */
  const undo = useCallback(() => {
    if (!history.length) return;

    const previous = history.at(-1);
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [todos, ...f]);
    setTodos(previous);
    toast.success("Undo applied");
  }, [history, todos]);

  const redo = useCallback(() => {
    if (!future.length) return;

    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, todos]);
    setTodos(next);
    toast.success("Redo applied");
  }, [future, todos]);

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "z") undo();
      if (e.ctrlKey && e.key === "y") redo();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  /* ---------------- DERIVED TODOS ---------------- */
  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);

  const filteredTodos = sortedTodos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  /* ---------------- CRUD ---------------- */
  const addTodo = async (title) => {
    if (!user || !user._id) {
      toast.error("User not ready");
      return;
    }

    try {
      const newTodo = {
        title,
        completed: false,
        order: todos.length,
        userId: user._id, // 🔥 REQUIRED
      };

      const updatedTodos = await createTodo(newTodo);

      if (!Array.isArray(updatedTodos)) {
        throw new Error("Invalid response from backend");
      }

      setTodos(updatedTodos);
      toast.success("Todo added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add todo");
    }
  };

  const removeTodo = async (_id) => {
  try {
    await deleteTodo(_id);

    setTodos((prev) => prev.filter((t) => t._id !== _id));

    toast.success("Todo deleted");
  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  }
};

  const toggleTodo = async (_id) => {
  const todo = todos.find((t) => t._id === _id);
  if (!todo) return;

  try {
    const updated = await updateTodo({
      ...todo,
      completed: !todo.completed,
    });

    setTodos((prev) =>
      prev.map((t) => (t._id === _id ? updated : t))
    );
  } catch {
    toast.error("Failed to update todo");
  }
};

  const editTodo = async (_id, title) => {
  const todo = todos.find((t) => t._id === _id);
  if (!todo) return;

  try {
    const updated = await updateTodo({ ...todo, title });

    setTodos((prev) =>
      prev.map((t) => (t._id === _id ? updated : t))
    );

    toast.success("Todo updated");
  } catch {
    toast.error("Update failed");
  }
};

  /* ---------------- DRAG & DROP ---------------- */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = [...todos];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const reordered = items.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    updateTodos(reordered);

    try {
      await Promise.all(reordered.map((t) => updateTodo(t)));
    } catch {
      toast.error("Order sync failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50
                  dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors">

    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight
                       bg-gradient-to-r from-indigo-500 to-purple-600
                       bg-clip-text text-transparent">
          My Todos
        </h1>

        {/* Undo / Redo */}
        <div className="flex gap-3">
          <button
            onClick={undo}
            disabled={!history.length}
            className="px-4 py-2 rounded-xl font-medium
                       bg-white/70 dark:bg-gray-800/70 backdrop-blur
                       shadow hover:shadow-lg hover:scale-105
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition"
          >
            Undo ⏪
          </button>

          <button
            onClick={redo}
            disabled={!future.length}
            className="px-4 py-2 rounded-xl font-medium
                       bg-white/70 dark:bg-gray-800/70 backdrop-blur
                       shadow hover:shadow-lg hover:scale-105
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition"
          >
            Redo ⏩
          </button>
        </div>
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="flex gap-3 mb-8">
        {["all", "completed", "pending"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full capitalize font-semibold transition-all
              ${
                filter === type
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white/60 dark:bg-gray-800/60 backdrop-blur hover:scale-105"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ---------- INPUT ---------- */}
      <div className="mb-10">
        <TodoInput addTodo={addTodo} />
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {filteredTodos.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="text-6xl mb-4">🎉</p>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No todos yet. Add your first task!
          </p>
        </div>
      ) : (
        /* ---------- TODO LIST ---------- */
        <DragDropContext
          onDragEnd={filter === "all" ? handleDragEnd : () => {}}
        >
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-5"
              >
                {filteredTodos.map((todo, index) => (
                  <Draggable
                    key={todo._id}
                    draggableId={String(todo._id)}
                    index={index}
                    isDragDisabled={filter !== "all"}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <TodoCard
                          todo={todo}
                          deleteTodo={removeTodo}
                          toggleTodo={toggleTodo}
                          editTodo={editTodo}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  </div>
);
}

export default Dashboard;

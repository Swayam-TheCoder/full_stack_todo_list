import { useEffect, useState, useCallback } from "react";
import TodoInput from "../components/TodoInput";
import TodoCard from "../components/TodoCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todos.api";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [filter, setFilter] = useState(
    () => localStorage.getItem("filter") || "all"
  );

  /* ---------------- LOAD TODOS ---------------- */
  useEffect(() => {
    const loadTodos = async () => {
      const data = await getTodos();
      setTodos(data);
    };
    loadTodos();
  }, []);

  /* ---------------- FILTER PERSIST ---------------- */
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  /* ---------------- STATE UPDATE HELPER ---------------- */
  const updateTodos = useCallback(
    (newTodos) => {
      if (filter === "all") {
        setHistory((prev) => [...prev, todos]);
        setFuture([]);
      }
      setTodos(newTodos);
    },
    [todos, filter]
  );

  /* ---------------- UNDO / REDO ---------------- */
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [todos, ...prev]);
    setTodos(previous);
    toast.success("Undo applied");
  }, [history, todos]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, todos]);
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

  /* ---------------- CRUD OPERATIONS ---------------- */
  const addTodo = async (title) => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      order: todos.length,
    };

    const updated = await createTodo(newTodo);
    updateTodos(updated);
    toast.success("Todo added");
  };

  const removeTodo = async (id) => {
    const updated = await deleteTodo(id);
    updateTodos(updated);
    toast.success("Todo deleted");
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updated = await updateTodo({
      ...todo,
      completed: !todo.completed,
    });
    updateTodos(updated);
  };

  const editTodo = async (id, newTitle) => {
    const todo = todos.find((t) => t.id === id);
    const updated = await updateTodo({
      ...todo,
      title: newTitle,
    });
    updateTodos(updated);
    toast.success("Todo updated");
  };

  /* ---------------- DRAG & DROP ---------------- */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const reordered = items.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    const persisted = await Promise.all(
      reordered.map((todo) => updateTodo(todo))
    );

    updateTodos(persisted);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Todos</h1>

      {/* Undo / Redo */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["all", "completed", "pending"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full capitalize transition ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <TodoInput addTodo={addTodo} />

      {filteredTodos.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          🎉 No todos yet. Add your first task!
        </p>
      ) : (
        <DragDropContext
          onDragEnd={filter === "all" ? handleDragEnd : () => {}}
        >
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              >
                {filteredTodos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id.toString()}
                    index={index}
                    isDragDisabled={filter !== "all"}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          transition: "transform 200ms ease",
                        }}
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
  );
}

export default Dashboard;
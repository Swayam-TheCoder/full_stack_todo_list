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

  useEffect(() => {
    if (!user) {
      return <p className="text-center mt-20">Loading user...</p>;
    } // 🔥 DO NOTHING until user exists

    const loadTodos = async () => {
      try {
        const data = await getTodos(user._id);
        setTodos(data);
      } catch (err) {
        toast.error("Failed to load todos");
        console.error(err);
      }
    };

    loadTodos();
  }, [user]); // 🔥 DEPENDS ON USER

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

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      updateTodos(todos.filter((t) => t.id !== id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = await updateTodo({
      ...todo,
      completed: !todo.completed,
    });

    updateTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const editTodo = async (id, title) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = await updateTodo({ ...todo, title });
    updateTodos(todos.map((t) => (t.id === id ? updated : t)));
    toast.success("Todo updated");
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
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Todos</h1>

      <div className="flex gap-3 mb-4">
        <button onClick={undo} disabled={!history.length}>
          Undo
        </button>
        <button onClick={redo} disabled={!future.length}>
          Redo
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        {["all", "completed", "pending"].map((type) => (
          <button key={type} onClick={() => setFilter(type)}>
            {type}
          </button>
        ))}
      </div>

      <TodoInput addTodo={addTodo} />

      {filteredTodos.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">🎉 No todos yet.</p>
      ) : (
        <DragDropContext
          onDragEnd={filter === "all" ? handleDragEnd : () => {}}
        >
          <Droppable droppableId="todos">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredTodos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={String(todo.id)}
                    index={index}
                    isDragDisabled={filter !== "all"}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
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

import { useEffect, useState } from "react";
import TodoInput from "../components/TodoInput";
import TodoCard from "../components/TodoCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";


function Dashboard() {

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  function updateTodos(newTodos) {
  setHistory([...history, todos]);
  setFuture([]); // clear redo
  setTodos(newTodos);
}

function undo() {
  if (history.length === 0) return;

  const previous = history[history.length - 1];
  setHistory(history.slice(0, -1));
  setFuture([todos, ...future]);
  setTodos(previous);
  toast("Undo applied");
}

function redo() {
  if (future.length === 0) return;

  const next = future[0];
  setFuture(future.slice(1));
  setHistory([...history, todos]);
  setTodos(next);
  toast("Redo applied");
}


  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const [filter, setFilter] = useState(
    () => localStorage.getItem("filter") || "all",
  );

  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);
  const filteredTodos = sortedTodos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  // CREATE
  function addTodo(title) {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      order: todos.length, // backend-ready
    };
    setTodos([newTodo, ...todos]);
    toast.success("Todo added");
  }

  // DELETE
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error("Todo deleted");
  }

  // TOGGLE COMPLETE
  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  // EDIT
  function editTodo(id, newTitle) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    );
    toast("Todo updated");
  }

  function handleDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    // 🔥 Reassign order
    const updated = items.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    updateTodos(updated);
  }
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Todos</h1>

      {/* Undo/redo buttons */}
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

      <div className="flex gap-3 mb-6">
        {["all", "completed", "pending"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full capitalize transition
        ${
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
                          deleteTodo={deleteTodo}
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

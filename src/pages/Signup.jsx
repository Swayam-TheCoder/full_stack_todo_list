import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 FRONTEND VALIDATION
    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      await registerUser(form);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass max-w-md mx-auto mt-24 p-8 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4 dark:text-white text-neon">
        Welcome 👋
      </h2>

      <input
        type="text"
        placeholder="Name"
        className="input"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="input mt-3"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="input mt-3"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn-primary mt-4 w-full neon">
        Signup
      </button>
    </form>
  );
}

export default Signup;
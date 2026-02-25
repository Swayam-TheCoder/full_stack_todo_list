import { useState } from "react";
import { registerUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("Account created");
      navigate("/");
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass max-w-md mx-auto mt-24 p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Welcome👋</h2>
      <input
        placeholder="Name"
        className="input"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        className="input mt-3"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="input mt-3"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="btn-primary mt-4 w-full neon">Signup</button>
    </form>
  );
}

export default Signup;
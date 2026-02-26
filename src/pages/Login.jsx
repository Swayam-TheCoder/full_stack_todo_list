import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser({ email, password });

    // ✅ STORE USER, NOT TOKEN
    login(res.data.user);

    toast.success("Logged in");
    navigate("/dashboard");
  } catch {
    toast.error("Invalid credentials");
  }
};

  return (
    <form onSubmit={handleSubmit} className="glass max-w-md mx-auto mt-24 p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4 dark:text-white text-neon">Welcome Back👋</h2>
      <input
        placeholder="Email"
        className="input"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input mt-3"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-primary mt-4 w-full neon">Login</button>
    </form>
  );
}

export default Login;
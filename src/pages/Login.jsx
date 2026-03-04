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

    // 🔴 FRONTEND VALIDATION
    if (!email || !password) {
      return toast.error("Email & password required");
    }

    try {
      const res = await loginUser({ email, password });

      // ✅ STORE USER (NO JWT AS PER YOUR SETUP)
      login(res.data.user);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass max-w-md mx-auto mt-24 p-8 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4 dark:text-white text-neon">
        Welcome Back 👋
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input mt-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn-primary mt-4 w-full neon">
        Login
      </button>
    </form>
  );
}

export default Login;
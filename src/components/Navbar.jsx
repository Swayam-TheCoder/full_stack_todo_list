import { useState } from "react";
import { Link } from "react-router-dom";
import DarkToggle from "./DarkToggle";

function Navbar({ user, setUser }) {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    setUser(null);
    setOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 glass neon">
  <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
      TodoPro ⚡
    </h1>

    {user ? (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
          text-white font-bold flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          {user.name[0]}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 glass animate-fade-in">
            <div className="px-4 py-3 text-sm border-b border-white/20">
              Signed in as
              <div className="font-bold">{user.name}</div>
            </div>

            <Link className="block px-4 py-2 hover:bg-white/10" to="/profile">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="flex gap-4">
        <Link className="btn-primary" to="/login">
          Login
        </Link>
        <Link to="/signup" className="btn-primary">
          Signup
        </Link>
      </div>
    )}

    <DarkToggle />
  </div>
</nav>
  );
}

export default Navbar;
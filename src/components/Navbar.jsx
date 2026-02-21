import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import DarkToggle from "./DarkToggle";

function Navbar({ user, setUser }) {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    setUser(null);
    setOpen(false);
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left */}
        <h1 className="text-xl font-bold text-blue-600">TodoPro</h1>

        {/* Right */}
        {user ? (
          <div className="relative">
            {/* Avatar Button */}
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"> 
              {user.name[0]}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Signed in as <br />
                  <b>{user.name}</b>
                </div>

                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Signup
            </Link>
          </div>
        )}
        {/* Dark Mode Toggle */}
        <DarkToggle />
      </div>
    </nav>
  );
}

export default Navbar;

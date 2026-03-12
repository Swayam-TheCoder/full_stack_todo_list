
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account.",
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/auth/delete-account", {
        withCredentials: true,
      });

      toast.success("Account deleted successfully");

      // redirect user to signup or homepage
      window.location.href = "/signup";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 glass p-8 text-center">
      <div
        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br
      from-blue-500 to-purple-600 text-white flex items-center
      justify-center text-3xl font-bold mb-4"
      >
        {user.name[0].toUpperCase()}
      </div>

      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

      <p className="text-gray-400">{user.email}</p>

      <div className="mt-6 text-sm text-gray-400">
        Welcome to your profile 🚀
      </div>
      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-6"
      >
        Delete Account
      </button>
    </div>
  );
}

export default Profile;

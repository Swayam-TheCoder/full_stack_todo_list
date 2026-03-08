import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-20 glass p-8 text-center">

      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br
      from-blue-500 to-purple-600 text-white flex items-center
      justify-center text-3xl font-bold mb-4">
        {user.name[0].toUpperCase()}
      </div>

      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>

      <p className="text-gray-400">{user.email}</p>

      <div className="mt-6 text-sm text-gray-400">
        Welcome to your profile 🚀
      </div>
    </div>
  );
}

export default Profile;
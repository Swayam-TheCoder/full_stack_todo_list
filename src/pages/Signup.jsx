function Signup() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Create Account
      </button>
    </div>
  );
}

export default Signup;
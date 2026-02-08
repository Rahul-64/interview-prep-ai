import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import API_PATHS from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";

export default function LoginPopup({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      if (!data.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", data.token);
      updateUser(data);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {/* Switch to Signup */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700 block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

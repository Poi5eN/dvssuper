// Login.jsx
import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaSchool, FaLock, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/superAdmin/loginSuperAdmin", {
        email,
        password,
      });
      // Save superAdmin data and token
      localStorage.setItem("user", JSON.stringify(data?.superAdmin));
      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now());
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Form */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center shadow-lg">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaSchool className="text-indigo-600 mr-2" /> SuperAdmin Login
          </h2>
          <div className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-none focus:outline-none text-gray-800"
                required
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none focus:outline-none text-gray-800"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right: Graphic / Welcome */}
      <div className="flex flex-col w-full md:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center text-white p-8">
        <h3 className="text-4xl font-bold mb-4">Welcome Back!</h3>
        <p className="mb-6 text-center max-w-sm">
          Enter your credentials to manage admins, third-party users, and
          schools. Stay on top of your dashboard and keep your organization
          running smoothly.
        </p>
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
          <p className="text-lg">
            <span role="img" aria-label="rocket">
              🚀
            </span>{" "}
            Empower your management.
          </p>
        </div>
      </div>

      {/* Fallback for small screens: show form full width */}
      <div className="md:hidden flex w-full bg-white items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <FaSchool className="text-indigo-600 mr-2" /> Login
          </h2>
          <div className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-none focus:outline-none text-gray-800"
                required
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none focus:outline-none text-gray-800"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

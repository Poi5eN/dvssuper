import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/super_admin_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/superAdmin/loginSuperAdmin", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(data?.superAdmin));
      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now());
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[30%] w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden m-4">
        {/* Left: Branding */}
        <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <img
            src={Logo}
            alt="Logo"
            className="w-32 h-32 mb-6 drop-shadow-2xl animate-tilt"
          />
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Digital Vidya Saarthi
          </h1>
          <p className="text-indigo-100 text-lg font-medium">
            Super Admin Portal
          </p>
          <p className="mt-8 text-sm text-indigo-200">
            Manage your organization with power and elegance.
          </p>
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-white/60">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center text-gradient">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
                Email Address
              </label>
              <div className="flex items-center bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm group-hover:shadow-md">
                <FaEnvelope className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
                Password
              </label>
              <div className="flex items-center bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-sm group-hover:shadow-md">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-indigo-600 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Forgot your password?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500 underline decoration-2 underline-offset-2"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

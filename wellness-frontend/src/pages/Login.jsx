import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };

      console.log("Sending login request:", payload);

      // Call backend API for login
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        const errorData = data;
        setError(errorData.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Store user data and tokens
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userRole", data.user.role);

      // Role-based navigation
      if (data.user.role === "PRACTITIONER") {
        navigate("/practitioner/dashboard");
      } else if (data.user.role === "ADMIN") {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE - HERO SECTION */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-700 to-teal-900 text-white p-16 flex-col justify-center relative overflow-hidden">

        {/* Glow effect */}
        <div className="absolute w-72 h-72 bg-teal-400 opacity-20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-teal-300 opacity-10 rounded-full blur-3xl bottom-0 right-0"></div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Your Wellness Journey Begins Here.
          </h1>

          <p className="text-lg text-teal-100 mb-8">
            A secure and intelligent platform designed for practitioners and patients 
            to collaborate seamlessly in real time.
          </p>

          <div className="space-y-4 text-teal-100">
            <div className="flex items-center gap-3">
              <span className="text-green-300">●</span>
              Encrypted JWT Authentication
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-300">●</span>
              Role-Based Access Control
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-300">●</span>
              Smart Dashboard & Analytics
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN CARD */}
      <div className="flex w-full md:w-1/2 bg-[#dcd6c8] items-center justify-center p-8">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

          <h2 className="text-3xl font-bold text-teal-800 text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>
              <button
                type="button"
                className="text-teal-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              {loading ? "Logging in..." : "login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-800 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
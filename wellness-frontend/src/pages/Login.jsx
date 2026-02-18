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

  const clearAuthStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminLoggedIn");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    clearAuthStorage();

    try {
      const payload = {
        email: credentials.email.trim(),
        password: credentials.password,
      };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        clearAuthStorage();
        setError("Invalid response from server. Please try again.");
        setLoading(false);
        return;
      }

      // Only treat as success when backend returns 200 and valid auth payload
      const success = response.ok && response.status === 200 && data && data.accessToken && data.user;

      if (!success) {
        clearAuthStorage();
        setError(data?.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Store only after confirmed success from backend
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userRole", data.user.role);

      // Role-based navigation
      if (data.user.role === "PRACTITIONER") {
        // Check if practitioner has completed onboarding
        try {
          const onboardingResponse = await fetch(
            "/api/practitioners/me/onboarding-status",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.accessToken}`
              }
            }
          );

          if (onboardingResponse.ok) {
            const onboardingStatus = await onboardingResponse.json();
            console.log("Onboarding status:", onboardingStatus);

            // If profile doesn't exist or not verified, go to onboarding
            if (!onboardingStatus.profileExists || !onboardingStatus.verified) {
              navigate("/practitioner/onboarding");
            } else {
              // Profile exists and verified, go to dashboard
              navigate("/practitioner/dashboard");
            }
          } else {
            // If status check fails, still go to dashboard (let them access)
            navigate("/practitioner/dashboard");
          }
        } catch (err) {
          console.error("Error checking onboarding status:", err);
          // On error, default to dashboard
          navigate("/practitioner/dashboard");
        }
      } else if (data.user.role === "ADMIN") {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      clearAuthStorage();
      setError("Could not reach server. Check your connection and try again.");
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
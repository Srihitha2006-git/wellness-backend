import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'PATIENT'
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: ""
      };

      console.log("Sending registration request:", payload);

      // Call backend API for registration
      const response = await fetch("http://localhost:8081/api/auth/register", {
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
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Save registration info
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userRole', data.user.role);

      // Navigate to login or role-specific page
      if (data.user.role === "PRACTITIONER") {
        navigate("/practitioner/onboarding");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f5f3ea] to-[#e7e2d3]">

      {/* LEFT SIDE BRAND PANEL */}
      <div className="hidden md:flex w-1/2 bg-[#1f6f66] text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Wellness
        </h1>
        <p className="text-lg opacity-90 leading-relaxed">
          Your personalized digital therapy platform.
          Secure. Private. Professional.
        </p>

        <div className="mt-10 space-y-3 text-sm opacity-80">
          <p>✔ Secure Authentication</p>
          <p>✔ Role Based Access</p>
          <p>✔ Real-time Dashboard</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-[#1f6f66] text-center mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Start your wellness journey today
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                FULL NAME
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                SELECT ROLE
              </label>
              <select
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="PATIENT">Patient/User</option>
                <option value="PRACTITIONER">Practitioner</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f6f66] text-white py-3 rounded-lg font-semibold hover:bg-[#155e57] disabled:bg-gray-400 transition duration-300 shadow-md"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1f6f66] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
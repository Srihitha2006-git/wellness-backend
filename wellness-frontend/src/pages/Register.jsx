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
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (password.length > 100) {
      return "Password must be less than 100 characters";
    }
    return null;
  };

  // Name validation
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);

    // Client-side validation
    const newErrors = {};
    
    const nameError = validateName(formData.fullName);
    if (nameError) {
      newErrors.fullName = nameError;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        bio: ""
      };

      console.log("Sending registration request:", payload);

      // Call backend API for registration
      const response = await fetch("/api/auth/register", {
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
        // Handle backend validation errors
        if (data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            if (key === 'name') backendErrors.fullName = data.errors[key];
            else backendErrors[key] = data.errors[key];
          });
          setErrors(backendErrors);
        }
        setError(data.message || "Registration failed. Please check your input and try again.");
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
                className={`w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.fullName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-[#1f6f66]'
                }`}
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({...formData, fullName: e.target.value});
                  if (errors.fullName) {
                    const newErrors = {...errors};
                    delete newErrors.fullName;
                    setErrors(newErrors);
                  }
                }}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className={`w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-[#1f6f66]'
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) {
                    const newErrors = {...errors};
                    delete newErrors.email;
                    setErrors(newErrors);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setErrors({...errors, email: "Please enter a valid email address"});
                  }
                }}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="•••••••• (minimum 6 characters)"
                className={`w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'focus:ring-[#1f6f66]'
                }`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if (errors.password) {
                    const newErrors = {...errors};
                    delete newErrors.password;
                    setErrors(newErrors);
                  }
                }}
                onBlur={(e) => {
                  const passwordError = validatePassword(e.target.value);
                  if (passwordError) {
                    setErrors({...errors, password: passwordError});
                  }
                }}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {!errors.password && formData.password && formData.password.length > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  {formData.password.length < 6 
                    ? `${6 - formData.password.length} more characters needed`
                    : '✓ Password length is valid'}
                </p>
              )}
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
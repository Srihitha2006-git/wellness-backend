
import { Link } from "react-router-dom";

export default function Login() {
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

          <form className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
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
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don’t have an account?{" "}
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

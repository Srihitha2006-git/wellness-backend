import { Link } from "react-router-dom";

export default function Register() {
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

          <form className="space-y-5">

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                FULL NAME
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
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
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                SELECT ROLE
              </label>
              <select
                className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
              >
                <option>User</option>
                <option>Practitioner</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1f6f66] text-white py-3 rounded-lg font-semibold hover:bg-[#155e57] transition duration-300 shadow-md"
            >
              Register
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

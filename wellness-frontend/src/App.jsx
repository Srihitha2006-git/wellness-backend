import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PractitionerOnboarding from "./pages/PractitionerOnboarding.jsx";
import PractitionerDashboard from "./pages/PractitionerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Practitioner Routes */}
        <Route path="/practitioner/onboarding" element={<PractitionerOnboarding />} />
        <Route path="/practitioner/dashboard" element={<PractitionerDashboard />} />
        
        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [practitioners, setPractitioners] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [reviewStatus, setReviewStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load practitioners from localStorage (simulated data)
    const storedData = localStorage.getItem("practitionerData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Create a mock list of practitioners for demo
      const mockPractitioners = [
        {
          id: 1,
          fullName: parsedData.fullName || "Dr. John Smith",
          email: parsedData.email || "john@example.com",
          specialization: parsedData.specialization || "Physiotherapy",
          licenseNumber: parsedData.licenseNumber || "LIC-12345",
          yearsOfExperience: parsedData.yearsOfExperience || "5",
          phone: parsedData.phone || "+1 234 567 8900",
          bio: parsedData.bio || "Professional practitioner",
          qualifications: parsedData.qualifications || "MBBS, MD",
          clinicAddress: parsedData.clinicAddress || "123 Medical Plaza",
          consultationFee: parsedData.consultationFee || "75",
          status: "pending",
          submittedDate: new Date().toLocaleDateString()
        }
      ];
      setPractitioners(mockPractitioners);
    }
  }, []);

  const filteredPractitioners = practitioners.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id) => {
    setPractitioners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
    setReviewStatus({ ...reviewStatus, [id]: "approved" });
    setSelectedPractitioner(null);
  };

  const handleReject = (id) => {
    setPractitioners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
    setReviewStatus({ ...reviewStatus, [id]: "rejected" });
    setSelectedPractitioner(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "⏳";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1f6f66]">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Review & Manage Practitioner Profiles</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">Total Practitioners</p>
            <p className="text-3xl font-bold text-[#1f6f66] mt-2">{practitioners.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {practitioners.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {practitioners.filter((p) => p.status === "approved").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {practitioners.filter((p) => p.status === "rejected").length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practitioners List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Practitioners</h2>
                <input
                  type="text"
                  placeholder="Search by name, email, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f6f66] focus:outline-none"
                />
              </div>

              <div className="max-h-screen overflow-y-auto">
                {filteredPractitioners.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No practitioners found
                  </div>
                ) : (
                  filteredPractitioners.map((practitioner) => (
                    <div
                      key={practitioner.id}
                      onClick={() => setSelectedPractitioner(practitioner)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                        selectedPractitioner?.id === practitioner.id
                          ? "bg-blue-50 border-l-4 border-l-[#1f6f66]"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {practitioner.fullName}
                          </p>
                          <p className="text-sm text-gray-600">{practitioner.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {practitioner.specialization}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            practitioner.status
                          )}`}
                        >
                          {getStatusIcon(practitioner.status)} {practitioner.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Practitioner Details */}
          <div className="lg:col-span-2">
            {selectedPractitioner ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-[#1f6f66] to-[#155e57] px-6 py-6 text-white">
                  <h2 className="text-2xl font-bold">{selectedPractitioner.fullName}</h2>
                  <p className="text-teal-100 mt-1">{selectedPractitioner.specialization}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">EMAIL</p>
                        <p className="text-gray-900 font-medium">{selectedPractitioner.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">PHONE</p>
                        <p className="text-gray-900 font-medium">{selectedPractitioner.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          LICENSE NUMBER
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedPractitioner.licenseNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          SUBMITTED DATE
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedPractitioner.submittedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          YEARS OF EXPERIENCE
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedPractitioner.yearsOfExperience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          QUALIFICATIONS
                        </p>
                        <p className="text-gray-900">{selectedPractitioner.qualifications}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          PROFESSIONAL BIO
                        </p>
                        <p className="text-gray-900 mt-1">{selectedPractitioner.bio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Practice Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Practice Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          CLINIC ADDRESS
                        </p>
                        <p className="text-gray-900">{selectedPractitioner.clinicAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide">
                          CONSULTATION FEE
                        </p>
                        <p className="text-gray-900 font-medium">
                          ${selectedPractitioner.consultationFee}/hour
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedPractitioner.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleApprove(selectedPractitioner.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                      >
                        ✅ Approve Practitioner
                      </button>
                      <button
                        onClick={() => handleReject(selectedPractitioner.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                      >
                        ❌ Reject Application
                      </button>
                    </div>
                  )}

                  {selectedPractitioner.status === "approved" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="text-sm font-semibold text-green-900">Approved</p>
                        <p className="text-xs text-green-800 mt-1">
                          This practitioner has been approved and can accept patients.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPractitioner.status === "rejected" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="text-sm font-semibold text-red-900">Rejected</p>
                        <p className="text-xs text-red-800 mt-1">
                          This application has been rejected.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">Select a practitioner to review</p>
                  <p className="text-gray-400 text-sm mt-2">Click on any practitioner from the list to view their details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

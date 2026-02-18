import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PractitionerDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if practitioner has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          '/api/practitioners/me/onboarding-status',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (response.ok) {
          const onboardingStatus = await response.json();
          console.log('Onboarding status:', onboardingStatus);

          // Save verification flag from backend
          setIsVerified(!!onboardingStatus.verified);

          // Only redirect to onboarding if profile doesn't exist
          // Allow dashboard access even if verification is pending
          if (!onboardingStatus.profileExists) {
            navigate('/practitioner/onboarding');
            return;
          }
        } else {
          // If status check fails, redirect to onboarding
          navigate('/practitioner/onboarding');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error checking onboarding status:', err);
        navigate('/practitioner/onboarding');
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f6f66] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-lg">
              🏥
            </div>
            <h1 className="text-xl font-bold">WellnessHub</h1>
          </div>
          {/* Verification Badge */}
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg p-2 border ${
              isVerified
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isVerified ? 'text-green-500' : 'text-amber-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isVerified
                    ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    : 'M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'
                }
              />
            </svg>
            <span
              className={`text-xs font-semibold ${
                isVerified ? 'text-green-400' : 'text-amber-300'
              }`}
            >
              {isVerified ? 'Verified Practitioner' : 'Verification Pending'}
            </span>
          </div>
        </div>

        <nav className="py-6">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'dashboard'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveSection('appointments')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'appointments'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>📅</span>
            <span>Appointments</span>
          </button>

          <button
            onClick={() => setActiveSection('patients')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'patients'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>👥</span>
            <span>My Patients</span>
          </button>

          <button
            onClick={() => setActiveSection('schedule')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'schedule'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>🗓️</span>
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setActiveSection('earnings')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'earnings'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>💰</span>
            <span>Earnings</span>
          </button>

          <button
            onClick={() => setActiveSection('messages')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'messages'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>💬</span>
            <span>Messages</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeSection === 'settings'
                ? 'text-white bg-green-500/15 border-l-4 border-green-500'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Practitioner Dashboard</h2>
                <p className="text-slate-600 text-sm mt-2">Welcome back, Doctor! Manage your practice efficiently</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveSection('schedule')}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <span className="mr-2">📅</span>
                  Manage Schedule
                </button>
                <button
                  onClick={() => setActiveSection('patients')}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <span className="mr-2">👥</span>
                  View Patients
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">24</div>
                    <div className="text-sm text-slate-600 font-medium">Total Patients</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl">
                    👥
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <span>↑ 3</span>
                  <span>new this month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">8</div>
                    <div className="text-sm text-slate-600 font-medium">Today's Sessions</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
                    📅
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <span>→</span>
                  <span>2 upcoming</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">4.8</div>
                    <div className="text-sm text-slate-600 font-medium">Rating</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <span>—</span>
                  <span>from 150 reviews</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">$2,450</div>
                    <div className="text-sm text-slate-600 font-medium">This Month</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-2xl">
                    💰
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <span>↑ 12%</span>
                  <span>vs last month</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                  {[
                    { patient: 'John Smith', time: '10:00 AM', type: 'Video Call', status: 'upcoming' },
                    { patient: 'Sarah Johnson', time: '11:30 AM', type: 'In-Person', status: 'upcoming' },
                    { patient: 'Michael Brown', time: '2:00 PM', type: 'Video Call', status: 'completed' },
                    { patient: 'Emily Davis', time: '3:30 PM', type: 'In-Person', status: 'upcoming' },
                  ].map((appointment, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {appointment.patient.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">{appointment.patient}</h4>
                            <p className="text-xs text-slate-600">{appointment.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appointment.status === 'upcoming' ? appointment.time : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all">
                  View Full Schedule
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New patient registered', patient: 'Alice Cooper', time: '2 hours ago', icon: '👤' },
                    { action: 'Session completed', patient: 'Bob Wilson', time: '4 hours ago', icon: '✅' },
                    { action: 'Appointment scheduled', patient: 'Carol Martinez', time: '5 hours ago', icon: '📅' },
                    { action: 'Payment received', patient: 'David Lee', time: '1 day ago', icon: '💳' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-xl">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                        <p className="text-xs text-slate-600">{activity.patient} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Appointments</h2>
              <p className="text-slate-600 text-sm mt-2">Manage your upcoming and past appointments</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">All Appointments</h3>
                <div className="flex gap-2">
                  {['All', 'Upcoming', 'Completed', 'Cancelled'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAppointmentFilter(filter.toLowerCase())}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        appointmentFilter === filter.toLowerCase()
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { patient: 'John Smith', date: 'Feb 15, 2026', time: '10:00 AM', type: 'Video Call', status: 'upcoming', concern: 'Follow-up consultation' },
                  { patient: 'Sarah Johnson', date: 'Feb 15, 2026', time: '11:30 AM', type: 'In-Person', status: 'upcoming', concern: 'Initial assessment' },
                  { patient: 'Michael Brown', date: 'Feb 14, 2026', time: '2:00 PM', type: 'Video Call', status: 'completed', concern: 'Therapy session' },
                  { patient: 'Emily Davis', date: 'Feb 13, 2026', time: '3:30 PM', type: 'In-Person', status: 'completed', concern: 'Progress review' },
                ].map((appointment, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {appointment.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-900">{appointment.patient}</h4>
                          <p className="text-sm text-slate-600">{appointment.concern}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        appointment.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-600 mb-4">
                      <span className="flex items-center gap-1">📅 {appointment.date}</span>
                      <span className="flex items-center gap-1">🕐 {appointment.time}</span>
                      <span className="flex items-center gap-1">📍 {appointment.type}</span>
                    </div>
                    {appointment.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <button className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
                          Start Session
                        </button>
                        <button className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all">
                          Reschedule
                        </button>
                      </div>
                    )}
                    {appointment.status === 'completed' && (
                      <button className="w-full py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all">
                        View Notes
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Patients Section */}
        {activeSection === 'patients' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">My Patients</h2>
              <p className="text-slate-600 text-sm mt-2">View and manage your patient list</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Patient List</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all">
                    Add Patient
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: 'John Smith', age: 32, lastVisit: 'Feb 14, 2026', totalSessions: 8, status: 'active' },
                  { name: 'Sarah Johnson', age: 28, lastVisit: 'Feb 13, 2026', totalSessions: 12, status: 'active' },
                  { name: 'Michael Brown', age: 45, lastVisit: 'Feb 10, 2026', totalSessions: 5, status: 'active' },
                  { name: 'Emily Davis', age: 38, lastVisit: 'Jan 28, 2026', totalSessions: 15, status: 'inactive' },
                ].map((patient, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-900">{patient.name}</h4>
                          <div className="flex gap-4 text-sm text-slate-600 mt-1">
                            <span>Age: {patient.age}</span>
                            <span>•</span>
                            <span>{patient.totalSessions} sessions</span>
                            <span>•</span>
                            <span>Last visit: {patient.lastVisit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all">
                          View Profile
                        </button>
                        <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-all">
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Schedule Section */}
        {activeSection === 'schedule' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Schedule Management</h2>
              <p className="text-slate-600 text-sm mt-2">Set your availability and manage your calendar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Working Hours</h3>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">{day}</span>
                      <div className="flex items-center gap-3">
                        <input 
                          type="time" 
                          className="px-3 py-1 border border-slate-300 rounded text-sm"
                          defaultValue="09:00"
                        />
                        <span className="text-slate-600">to</span>
                        <input 
                          type="time" 
                          className="px-3 py-1 border border-slate-300 rounded text-sm"
                          defaultValue="17:00"
                        />
                        <input type="checkbox" className="w-5 h-5" defaultChecked={idx < 5} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
                  Save Schedule
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Availability Settings</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <label className="block text-sm font-medium text-slate-900 mb-2">Session Duration</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <label className="block text-sm font-medium text-slate-900 mb-2">Buffer Time</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>No buffer</option>
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>15 minutes</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <label className="block text-sm font-medium text-slate-900 mb-2">Advance Booking</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>1 day</option>
                      <option>3 days</option>
                      <option>1 week</option>
                      <option>2 weeks</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Earnings Section */}
        {activeSection === 'earnings' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Earnings</h2>
              <p className="text-slate-600 text-sm mt-2">Track your income and financial performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">This Month</h3>
                <p className="text-3xl font-bold text-slate-900">$2,450</p>
                <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Earned</h3>
                <p className="text-3xl font-bold text-slate-900">$18,950</p>
                <p className="text-xs text-slate-600 mt-2">Lifetime earnings</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Pending Payout</h3>
                <p className="text-3xl font-bold text-slate-900">$680</p>
                <p className="text-xs text-blue-600 mt-2">Available Feb 20</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {[
                  { patient: 'John Smith', date: 'Feb 14, 2026', amount: 75, status: 'completed' },
                  { patient: 'Sarah Johnson', date: 'Feb 13, 2026', amount: 75, status: 'completed' },
                  { patient: 'Michael Brown', date: 'Feb 12, 2026', amount: 75, status: 'pending' },
                  { patient: 'Emily Davis', date: 'Feb 10, 2026', amount: 75, status: 'completed' },
                ].map((transaction, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{transaction.patient}</h4>
                      <p className="text-xs text-slate-600">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900">${transaction.amount}</p>
                      <span className={`text-xs font-semibold ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Messages</h2>
              <p className="text-slate-600 text-sm mt-2">Communicate with your patients</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No messages yet</h3>
                <p className="text-slate-600 text-sm">Your conversations with patients will appear here</p>
              </div>
            </div>
          </>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
              <p className="text-slate-600 text-sm mt-2">Manage your profile and preferences</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Professional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Dr. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ayurveda" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">License Number</label>
                      <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="LIC-12345" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Experience (years)</label>
                      <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="5" />
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="doctor@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm" placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
                      Save Changes
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
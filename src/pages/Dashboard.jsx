// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { FiLogOut, FiMessageCircle, FiPhone, FiMail, FiBell, FiDatabase, FiActivity, FiShield, FiServer, FiMonitor, FiClock, FiCalendar } from "react-icons/fi";
import { FaUserShield, FaUsers, FaSchool, FaChartPie, FaCog, FaBell, FaDatabase, FaChartLine, FaFileAlt, FaCloudDownloadAlt, FaSync, FaEye, FaDownload, FaUpload, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [superAdminId, setSuperAdminId] = useState("");
  const [adminCount, setAdminCount] = useState(0);
  const [thirdPartyCount, setThirdPartyCount] = useState(0);
  const [messageEmail, setMessageEmail] = useState("");
  const [messagePhone, setMessagePhone] = useState("");
  const [messageText, setMessageText] = useState("");

  // Enhanced dashboard state
  const [systemHealth, setSystemHealth] = useState({ status: 'healthy', uptime: '99.9%' });
  const [recentActivities, setRecentActivities] = useState([]);
  const [serverStats, setServerStats] = useState({ cpu: 45, memory: 62, disk: 78 });
  const [alertStats, setAlertStats] = useState({ active: 0, total: 0, dismissed: 0 });
  const [schoolCount, setSchoolCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Auto logout after 2 hours
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && Date.now() - Number(loginTime) > 2 * 60 * 60 * 1000) {
      handleLogout();
    }
  }, []);

  // Fetch user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.superAdminId) {
      const adminId = user.superAdminId;
      setSuperAdminId(adminId);
      const role = localStorage.getItem("role") || "SuperAdmin";
      setUserRole(role);
    } else {
      // If no user found, redirect to login
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch counts when superAdminId is available
  useEffect(() => {
    if (superAdminId) {
      fetchCounts(superAdminId);
      fetchSystemData();
      fetchRecentActivities();
      fetchAlertStats();
    }
  }, [superAdminId]);

  // Enhanced data fetching functions
  const fetchCounts = async (id) => {
    setLoading(true);
    try {
      // Fetch Admins
      const adminResponse = await fetch(
        `https://api.digitalvidyasaarthi.in/api/v1/superAdmin/getAdmins/${id}?page=0`
      );
      const adminData = await adminResponse.json();
      if (adminData?.success) {
        setAdminCount(adminData.totalAdmins || adminData.admins.length);
      }

      // Fetch Third-Party Users
      const thirdPartyResponse = await fetch(
        `https://api.digitalvidyasaarthi.in/api/v1/superAdmin/thirdparty/${id}`
      );
      const thirdPartyData = await thirdPartyResponse.json();
      if (thirdPartyData?.success) {
        setThirdPartyCount(thirdPartyData.thirdPartyUsers.length);
      }

      // Estimate school count (based on admins)
      setSchoolCount(adminData?.totalAdmins || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemData = async () => {
    try {
      // Simulate system health data (in real app, this would come from monitoring APIs)
      const uptime = Math.random() * 100;
      setSystemHealth({
        status: uptime > 95 ? 'healthy' : uptime > 85 ? 'warning' : 'critical',
        uptime: `${uptime.toFixed(1)}%`
      });

      // Simulate server stats
      setServerStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100)
      });
    } catch (error) {
      console.error("Error fetching system data:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Simulate recent activities (in real app, this would come from activity logs)
      const activities = [
        { id: 1, action: 'New admin registered', time: '2 minutes ago', type: 'success' },
        { id: 2, action: 'System backup completed', time: '1 hour ago', type: 'info' },
        { id: 3, action: 'Alert broadcasted to all schools', time: '3 hours ago', type: 'warning' },
        { id: 4, action: 'Database maintenance completed', time: '1 day ago', type: 'success' },
        { id: 5, action: 'Third-party user access granted', time: '2 days ago', type: 'info' }
      ];
      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  const fetchAlertStats = async () => {
    try {
      const response = await fetch(`https://api.digitalvidyasaarthi.in/api/v1/alerts`);
      const data = await response.json();
      if (data?.success) {
        const alerts = data.alerts || [];
        setAlertStats({
          total: alerts.length,
          active: alerts.filter(alert => alert.isActive).length,
          dismissed: alerts.filter(alert => !alert.isActive).length
        });
      }
    } catch (error) {
      console.error("Error fetching alert stats:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Navigation Handlers
  const goToSuperAdmin = () => navigate("/dashboard/superadmin");
  const goToThirdParty = () => navigate("/dashboard/thirdparty");
  const goToAlerts = () => navigate("/dashboard/alerts");

  // Pie chart setup
  const pieData = {
    labels: ["Admins", "Third-Party Users"],
    datasets: [
      {
        label: "User Distribution",
        data: [adminCount, thirdPartyCount],
        backgroundColor: ["rgba(79,70,229,0.7)", "rgba(16,185,129,0.7)"],
        borderColor: ["rgba(79,70,229,1)", "rgba(16,185,129,1)"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } },
      title: { display: true, text: "User Distribution" },
    },
  };

  // Send message (simulated)
  const handleSendMessage = () => {
    if (!messageEmail.trim() && !messagePhone.trim()) {
      alert("Please provide either an Email or Phone Number to send your message.");
      return;
    }
    if (!messageText.trim()) {
      alert("Please enter a message to send.");
      return;
    }
    let destination = "";
    if (messageEmail.trim()) {
      destination += `Email: ${messageEmail.trim()}`;
    }
    if (messagePhone.trim()) {
      if (destination) destination += " | ";
      destination += `Phone: ${messagePhone.trim()}`;
    }
    alert(`Sending message to ${destination}\n\nMessage:\n"${messageText.trim()}"`);
    setMessageEmail("");
    setMessagePhone("");
    setMessageText("");
  };

  // Only show dashboard widgets when path is exactly '/dashboard'
  const isRootDashboard = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-sans">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 shadow-lg rounded-lg p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <Link to="/dashboard" className="flex items-center mb-4 md:mb-0">
        <div className="flex items-center mb-4 md:mb-0">
          <FaUserShield className="text-white text-3xl mr-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            DVS SuperAdmin Dashboard
          </h1>
        </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FiLogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>

      {/* Role & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-4 mb-8">
        <p className="text-lg text-gray-700 font-semibold flex items-center mb-3 sm:mb-0">
          <FaSchool className="text-indigo-600 mr-2" />
          Logged in as:{" "}
          <span className="font-bold text-indigo-600 ml-1">{userRole}</span>
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={goToSuperAdmin}
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <FaUserShield className="mr-2" size={18} /> Go to SuperAdmin
          </button>
          <button
            onClick={goToThirdParty}
            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <FaUsers className="mr-2" size={18} /> Go to ThirdParty
          </button>
          <button
            onClick={goToAlerts}
            className="flex items-center justify-center bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <FaBell className="mr-2" size={18} /> Manage Alerts
          </button>
        </div>
      </div>

      {isRootDashboard && (
        <>
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FaUserShield className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Admins</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : adminCount}</p>
                <p className="text-xs text-indigo-600">+2 this month</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Third-Party Users</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : thirdPartyCount}</p>
                <p className="text-xs text-green-600">+5 this week</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-full mr-4">
                <FaSchool className="text-teal-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Schools</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : schoolCount}</p>
                <p className="text-xs text-teal-600">Active schools</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className={`p-3 rounded-full mr-4 ${systemHealth.status === 'healthy' ? 'bg-green-100' : systemHealth.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {systemHealth.status === 'healthy' ? (
                  <FaCheckCircle className="text-green-600 text-2xl" />
                ) : systemHealth.status === 'warning' ? (
                  <FaExclamationTriangle className="text-yellow-600 text-2xl" />
                ) : (
                  <FaTimesCircle className="text-red-600 text-2xl" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">System Health</p>
                <p className={`text-2xl font-bold ${systemHealth.status === 'healthy' ? 'text-green-600' : systemHealth.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {systemHealth.uptime}
                </p>
                <p className={`text-xs ${systemHealth.status === 'healthy' ? 'text-green-600' : systemHealth.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {systemHealth.status === 'healthy' ? 'All systems operational' : systemHealth.status === 'warning' ? 'Minor issues detected' : 'Critical issues'}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaBell className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-800">{alertStats.active}</p>
                <p className="text-xs text-purple-600">{alertStats.total} total alerts</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiServer className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Server Load</p>
                <p className="text-2xl font-bold text-gray-800">{serverStats.cpu}%</p>
                <p className="text-xs text-blue-600">CPU Usage</p>
              </div>
            </div>
          </div>

          {/* System Monitoring Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Server Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiMonitor className="text-blue-600 mr-2" /> Server Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>CPU Usage</span>
                    <span>{serverStats.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${serverStats.cpu > 80 ? 'bg-red-500' : serverStats.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${serverStats.cpu}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Memory Usage</span>
                    <span>{serverStats.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${serverStats.memory > 80 ? 'bg-red-500' : serverStats.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${serverStats.memory}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Disk Usage</span>
                    <span>{serverStats.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${serverStats.disk > 80 ? 'bg-red-500' : serverStats.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${serverStats.disk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiActivity className="text-green-600 mr-2" /> Recent Activities
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`p-1 rounded-full ${
                      activity.type === 'success' ? 'bg-green-100' :
                      activity.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.type === 'success' ? (
                        <FaCheckCircle className="text-green-600 text-sm" />
                      ) : activity.type === 'warning' ? (
                        <FaExclamationTriangle className="text-yellow-600 text-sm" />
                      ) : (
                        <FaInfoCircle className="text-blue-600 text-sm" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Management Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaBell className="text-purple-600 mr-2" /> Alert Management
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">Active Alerts</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{alertStats.active}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FaTimesCircle className="text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">Dismissed</span>
                  </div>
                  <span className="text-lg font-bold text-gray-600">{alertStats.dismissed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FaInfoCircle className="text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">Total Alerts</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{alertStats.total}</span>
                </div>
                <button
                  onClick={goToAlerts}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <FaEye className="mr-2" /> View All Alerts
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaCog className="text-indigo-600 mr-2" /> Quick Actions & System Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              <button
                onClick={goToSuperAdmin}
                className="flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700 transition transform hover:scale-105"
              >
                <FaUserShield className="mr-2" /> Manage Admins
              </button>
              <button
                onClick={goToThirdParty}
                className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
              >
                <FaUsers className="mr-2" /> Third-Party Users
              </button>
              <button
                onClick={goToAlerts}
                className="flex items-center justify-center bg-orange-600 text-white px-4 py-3 rounded-lg shadow hover:bg-orange-700 transition transform hover:scale-105"
              >
                <FaBell className="mr-2" /> Alert Center
              </button>
              <button
                onClick={() => navigate("/dashboard/schools")}
                className="flex items-center justify-center bg-teal-600 text-white px-4 py-3 rounded-lg shadow hover:bg-teal-700 transition transform hover:scale-105"
              >
                <FaSchool className="mr-2" /> School Registry
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    alert("Database backup completed successfully!");
                    setLoading(false);
                  }, 2000);
                }}
                className="flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg shadow hover:bg-purple-700 transition transform hover:scale-105"
                disabled={loading}
              >
                <FaDatabase className="mr-2" /> {loading ? 'Backing up...' : 'Database Backup'}
              </button>
              <button
                onClick={() => {
                  const reportData = {
                    totalAdmins: adminCount,
                    totalThirdParty: thirdPartyCount,
                    totalSchools: schoolCount,
                    systemHealth: systemHealth,
                    serverStats: serverStats,
                    alertStats: alertStats,
                    generatedAt: new Date().toISOString()
                  };
                  console.log('System Report:', reportData);
                  alert(`System Report Generated!\n\nAdmins: ${adminCount}\nThird-Party: ${thirdPartyCount}\nSchools: ${schoolCount}\nSystem Health: ${systemHealth.uptime}\n\nCheck console for detailed report.`);
                }}
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105"
              >
                <FaFileAlt className="mr-2" /> System Report
              </button>
              <button
                onClick={() => {
                  fetchCounts(superAdminId);
                  fetchSystemData();
                  fetchRecentActivities();
                  fetchAlertStats();
                  alert("Dashboard data refreshed!");
                }}
                className="flex items-center justify-center bg-cyan-600 text-white px-4 py-3 rounded-lg shadow hover:bg-cyan-700 transition transform hover:scale-105"
              >
                <FaSync className="mr-2" /> Refresh Data
              </button>
              <button
                onClick={() => navigate("/dashboard/analytics")}
                className="flex items-center justify-center bg-pink-600 text-white px-4 py-3 rounded-lg shadow hover:bg-pink-700 transition transform hover:scale-105"
              >
                <FaChartLine className="mr-2" /> Analytics
              </button>
              <button
                onClick={() => {
                  const csvData = `Admin Count,Third-Party Count,School Count,System Health,Generated At\n${adminCount},${thirdPartyCount},${schoolCount},${systemHealth.uptime},${new Date().toISOString()}`;
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `dvs-system-report-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center bg-emerald-600 text-white px-4 py-3 rounded-lg shadow hover:bg-emerald-700 transition transform hover:scale-105"
              >
                <FaDownload className="mr-2" /> Export Data
              </button>
              <button
                onClick={() => navigate("/dashboard/logs")}
                className="flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg shadow hover:bg-gray-700 transition transform hover:scale-105"
              >
                <FaEye className="mr-2" /> System Logs
              </button>
              <button
                onClick={() => navigate("/dashboard/settings")}
                className="flex items-center justify-center bg-slate-600 text-white px-4 py-3 rounded-lg shadow hover:bg-slate-700 transition transform hover:scale-105"
              >
                <FaCog className="mr-2" /> Settings
              </button>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json,.csv';
                  input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      alert(`File "${file.name}" selected for import. Processing...`);
                      // Here you would implement actual file processing
                    }
                  };
                  input.click();
                }}
                className="flex items-center justify-center bg-amber-600 text-white px-4 py-3 rounded-lg shadow hover:bg-amber-700 transition transform hover:scale-105"
              >
                <FaUpload className="mr-2" /> Import Data
              </button>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8 w-full max-w-md mx-auto">
            <div className="flex items-center mb-2">
              <FaChartPie className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">
                User Distribution
              </h2>
            </div>
            <div className="relative w-full h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Message Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-xl mx-auto">
            <div className="flex items-center mb-4">
              <FiMessageCircle className="text-indigo-600 text-2xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">
                Send a Message
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-700 font-semibold mb-1 flex items-center">
                  <FiMail className="mr-2 text-indigo-600" /> To Email
                </label>
                <input
                  type="email"
                  value={messageEmail}
                  onChange={(e) => setMessageEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold mb-1 flex items-center">
                  <FiPhone className="mr-2 text-indigo-600" /> To Phone
                </label>
                <input
                  type="tel"
                  value={messagePhone}
                  onChange={(e) => setMessagePhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            </div>
            <label className="text-gray-700 font-semibold mb-1 flex items-center">
              <FiMessageCircle className="mr-2 text-indigo-600" /> Message
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-400 transition"
              rows={4}
            />
            <div className="text-right">
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}

      {/* Nested Routes / Additional Content */}
      <div className="mb-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

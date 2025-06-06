// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { FiLogOut, FiMessageCircle, FiPhone, FiMail } from "react-icons/fi";
import { FaUserShield, FaUsers, FaSchool, FaChartPie, FaCog } from "react-icons/fa";
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
      setSuperAdminId(user.superAdminId);
      const role = localStorage.getItem("role") || "SuperAdmin";
      setUserRole(role);
      fetchCounts(user.superAdminId);
    } else {
      // If no user found, redirect to login
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch counts for Admins and Third-Party Users
  const fetchCounts = async (id) => {
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
    } catch (error) {
      console.error("Error fetching counts:", error);
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
        </div>
      </div>

      {isRootDashboard && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FaUserShield className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Admins</p>
                <p className="text-2xl font-bold text-gray-800">{adminCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Third-Party Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {thirdPartyCount}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="bg-teal-100 p-3 rounded-full mr-4">
                <FaSchool className="text-teal-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Schools</p>
                <p className="text-2xl font-bold text-gray-800">—</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaCog className="text-indigo-600 mr-2" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={goToSuperAdmin}
                className="flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                <FaUserShield className="mr-2" /> Manage Admins
              </button>
              <button
                onClick={goToThirdParty}
                className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition"
              >
                <FaUsers className="mr-2" /> Manage Third-Party
              </button>
              <button
                onClick={() => navigate("/dashboard/schools")}
                className="flex items-center justify-center bg-teal-600 text-white px-4 py-3 rounded-lg shadow hover:bg-teal-700 transition"
              >
                <FaSchool className="mr-2" /> Manage Schools
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

import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaUserShield, FaUsers } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [adminCount, setAdminCount] = useState(0);
  const [thirdPartyCount, setThirdPartyCount] = useState(0);

  // Auto logout after 2 hours
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime && Date.now() - Number(loginTime) > 2 * 60 * 60 * 1000) {
      handleLogout();
    }
  }, []);

  // Fetch user role from localStorage
  const fetchUserRole = () => {
    const role = localStorage.getItem("role");
    setUserRole(role || "SuperAdmin");
  };

  // Fetch counts for Admins and ThirdParty Users
  const fetchCounts = async () => {
    try {
      const superAdminId = "9a738ef4-e637-4067-bee6-dc0ea84d7aa1"; // Update accordingly
      // Fetch Admins
      const adminResponse = await fetch(
        `https://dvsserver.onrender.com/api/v1/superAdmin/getAdmins/${superAdminId}?page=0`
      );
      const adminData = await adminResponse.json();
      if (adminData?.success) {
        setAdminCount(adminData.totalAdmins || adminData.admins.length);
      }

      // Fetch ThirdParty Users
      const thirdPartyResponse = await fetch(
        `https://dvsserver.onrender.com/api/v1/superAdmin/thirdparty/${superAdminId}`
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

  useEffect(() => {
    fetchUserRole();
    fetchCounts();
  }, []);

  // Setup data for the chart
  const chartData = {
    labels: ["Admins", "ThirdParty Users"],
    datasets: [
      {
        label: "Count",
        data: [adminCount, thirdPartyCount],
        backgroundColor: ["rgba(79,70,229,0.7)", "rgba(16,185,129,0.7)"],
        borderColor: ["rgba(79,70,229,1)", "rgba(16,185,129,1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "User Counts Overview" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8 shadow-lg rounded-lg p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          DVS SuperAdmin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FiLogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>

      {/* User Role Info */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-8">
        <p className="text-lg text-gray-700 font-semibold">
          Logged in as:{" "}
          <span className="font-bold text-indigo-600">{userRole}</span>
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          onClick={goToSuperAdmin}
          className="flex items-center justify-center w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <FaUserShield className="mr-2" size={20} /> Go to SuperAdmin
        </button>
        <button
          onClick={goToThirdParty}
          className="flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <FaUsers className="mr-2" size={20} /> Go to ThirdParty
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8 w-full max-w-md mx-auto">
        <div className="relative w-full h-60">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Renders Nested Components */}
      <Outlet />
    </div>
  );
};

export default Dashboard;

import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSchool,
  FaUserCog,
  FaChartBar,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Logo from "../../assets/dvs_super_admin_logo_vibrant.png";

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Manage Schools", icon: <FaSchool />, path: "/dashboard/schools" },
    { name: "Admins", icon: <FaUserCog />, path: "/dashboard/superadmin" },
    { name: "Third Party", icon: <FaUsers />, path: "/dashboard/thirdparty" },
    { name: "Reports", icon: <FaChartBar />, path: "/dashboard/reports" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform 
        bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-white/5 
        shadow-2xl transition-all duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-6 border-b border-gray-200/20 dark:border-white/10 h-20`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={Logo}
              alt="DVS Logo"
              className="h-14 w-14 object-contain"
            />
            {!isCollapsed && (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 whitespace-nowrap">
                SuperAdmin
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-red-500 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 text-gray-500 hover:text-indigo-600 shadow-md z-50"
        >
          {isCollapsed ? (
            <FaChevronRight size={12} />
          ) : (
            <FaChevronLeft size={12} />
          )}
        </button>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" &&
                location.pathname === "/dashboard/");

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={`flex items-center ${
                  isCollapsed ? "justify-center px-2" : "px-4"
                } py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
                title={isCollapsed ? item.name : ""}
              >
                <span
                  className={`text-xl ${isCollapsed ? "" : "mr-3"} ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "w-full px-4"
            } py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300`}
            title={isCollapsed ? "Logout" : ""}
          >
            <FaSignOutAlt className={`text-xl ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

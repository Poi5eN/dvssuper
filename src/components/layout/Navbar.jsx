import { FaBars, FaBell, FaMoon, FaSun } from "react-icons/fa";
import Logo from "../../assets/super_admin_logo.png";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/20 dark:border-white/5 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-white/20 rounded-lg transition"
        >
          <FaBars size={24} />
        </button>

        {/* Breadcrumb or Page Title could go here */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden md:block">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition bg-white/50 dark:bg-black/20 rounded-full shadow-sm"
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          <FaBell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200/50 dark:border-white/10">
          <img
            src={Logo}
            alt="Super Admin"
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {user?.name || "Super Admin"}
            </p>
            <p className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full inline-block">
              Administrator
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition">
            <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600">
                {user?.name?.charAt(0) || "S"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

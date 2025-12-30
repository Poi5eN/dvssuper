import { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaChartBar,
  FaFileAlt,
  FaTable,
} from "react-icons/fa";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            System Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate and view comprehensive system analytics.
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FaFilter className="mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          User Activity
        </button>
        <button
          onClick={() => setActiveTab("financial")}
          className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "financial"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Financials
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder Report Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaChartBar className="mr-2 text-indigo-500" />
              {activeTab === "overview"
                ? "Traffic Overview"
                : activeTab === "users"
                ? "User Growth"
                : "Revenue Trends"}
            </h3>
            <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
              <p className="text-gray-400 dark:text-gray-500">
                Chart Visualization Placeholder
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaTable className="mr-2 text-green-500" /> Recent Data
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Event</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">#TRX-001</td>
                    <td className="px-6 py-4">System Backup</td>
                    <td className="px-6 py-4">2024-03-15</td>
                    <td className="px-6 py-4 text-green-600">Completed</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">#USR-892</td>
                    <td className="px-6 py-4">New Admin Signup</td>
                    <td className="px-6 py-4">2024-03-14</td>
                    <td className="px-6 py-4 text-blue-600">Verified</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4">#ALR-554</td>
                    <td className="px-6 py-4">High CPU Usage</td>
                    <td className="px-6 py-4">2024-03-14</td>
                    <td className="px-6 py-4 text-red-600">Resolved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-lg mb-2">Pro Reports</h4>
            <p className="text-indigo-100 text-sm mb-4">
              Unlock advanced analytics and PDF exports with the pro tier.
            </p>
            <button className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition">
              Upgrade Now
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">
              Quick Filters
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 rounded"
                  defaultChecked
                />
                <span>Last 24 Hours</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 rounded"
                />
                <span>Last 7 Days</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 rounded"
                />
                <span>Last 30 Days</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

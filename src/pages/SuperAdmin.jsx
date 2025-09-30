import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import ReactPaginate from "react-paginate";
import { FaSchool, FaTimes, FaSearch, FaFilter, FaDownload, FaEdit, FaTrash, FaEye, FaUserPlus, FaSync, FaCheck, FaBan } from "react-icons/fa";

const SuperAdmin = () => {
  const [superId, setSuperID] = useState();
  const [allAdmin, setAllAdmin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    schoolName: "",
    contact: "",
    feeMessage: "",
    schoolState: "",
    schoolCity: "",
    admissionMessage: "",
    registrationMessage: "",
    pincode: "",
    superAdminId: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all admins once
  useEffect(() => {
    if (user?.superAdminId) {
      setSuperID(user.superAdminId);
      setFormData((prev) => ({ ...prev, superAdminId: user.superAdminId }));
      fetchAllAdmins(user.superAdminId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllAdmins = async (superAdminId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/superAdmin/getAdmins/${superAdminId}`);
      if (data?.admins) {
        setAllAdmin(data.admins);
      }
    } catch {
      setError("Failed to fetch admin list.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  // Filter then paginate
  const filteredAdmins = getFilteredAndSortedAdmins();
  const paginatedAdmins = filteredAdmins.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const displayPageCount = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/superAdmin/createAdmin", formData);
      if (response?.data?.success) {
        alert("Admin Created Successfully!");
        await fetchAllAdmins(formData.superAdminId);
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      address: "",
      schoolName: "",
      contact: "",
      feeMessage: "",
      schoolState: "",
      schoolCity: "",
      admissionMessage: "",
      registrationMessage: "",
      pincode: "",
      superAdminId: superId,
    });
    setIsUpdate(false);
  };

  const handleEdit = async (adminId) => {
    try {
      const { data } = await api.get(`/superAdmin/getAdmin/${adminId}`);
      setFormData(data.admin);
      setIsUpdate(true);
      setShowModal(true);
    } catch {
      setError("Failed to fetch admin details.");
    }
  };

  // Enhanced filtering and sorting
  const getFilteredAndSortedAdmins = () => {
    let filtered = allAdmin.filter((admin) => {
      const matchesSearch = admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.schoolName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
      const matchesCity = !cityFilter || admin.schoolCity?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesState = !stateFilter || admin.schoolState?.toLowerCase().includes(stateFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCity && matchesState;
    });

    // Sort admins
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Bulk operations
  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins(prev =>
      prev.includes(adminId)
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = () => {
    const filteredAdmins = getFilteredAndSortedAdmins();
    const allSelected = filteredAdmins.every(admin => selectedAdmins.includes(admin._id));

    if (allSelected) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(filteredAdmins.map(admin => admin._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAdmins.length === 0) {
      alert('Please select admins to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedAdmins.length} selected admins?`)) {
      try {
        await Promise.all(
          selectedAdmins.map(adminId =>
            api.delete(`/superAdmin/deleteAdmin/${adminId}`)
          )
        );
        alert('Selected admins deleted successfully!');
        setSelectedAdmins([]);
        await fetchAllAdmins(superId);
      } catch {
        setError('Failed to delete selected admins.');
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedAdmins.length === 0) {
      alert('Please select admins to update.');
      return;
    }

    try {
      await Promise.all(
        selectedAdmins.map(adminId =>
          api.patch(`/superAdmin/updateAdminStatus/${adminId}`, { status: newStatus })
        )
      );
      alert(`Selected admins ${newStatus} successfully!`);
      setSelectedAdmins([]);
      await fetchAllAdmins(superId);
    } catch {
      setError(`Failed to ${newStatus} selected admins.`);
    }
  };

  // Enhanced CSV export with filters
  const downloadFilteredCSV = () => {
    const filteredAdmins = getFilteredAndSortedAdmins();
    downloadCSV(filteredAdmins);
  };

  // Refresh data
  const handleRefresh = async () => {
    await fetchAllAdmins(superId);
    setSelectedAdmins([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-2xl rounded-xl mt-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Super Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Manage all school administrators</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
            title="Refresh Data"
          >
            <FaSync className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300"
          >
            <FaUserPlus className="mr-2 text-lg sm:text-xl" />
            Create Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 text-center font-medium">
          {error}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {isUpdate ? "Update Admin" : "Create New Admin"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsUpdate(false);
                }}
                className="text-gray-500 hover:text-gray-700 transition"
                title="Close Modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {/* Input Fields */}
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Address", name: "address", type: "text" },
                { label: "School Name", name: "schoolName", type: "text" },
                { label: "Contact Number", name: "contact", type: "number" },
                { label: "State", name: "schoolState", type: "text" },
                { label: "City", name: "schoolCity", type: "text" },
                { label: "Pincode", name: "pincode", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={["email", "password", "schoolName"].includes(
                      name
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}

              {/* Text Areas */}
              {[
                { label: "Fee Message", name: "feeMessage" },
                { label: "Admission Message", name: "admissionMessage" },
                { label: "Registration Message", name: "registrationMessage" },
              ].map(({ label, name }) => (
                <div className="col-span-full" key={name}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {label}
                  </label>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    rows={3}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}

              {/* Submit Button */}
              <div className="col-span-full text-center mt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 inline-flex items-center"
                  disabled={loading}
                >
                  {loading
                    ? isUpdate
                      ? "Updating..."
                      : "Creating..."
                    : isUpdate
                    ? "Update Admin"
                    : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or school..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <FaFilter className="mr-2" />
              Filters {showFilters ? '▲' : '▼'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadFilteredCSV}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              <FaDownload className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Filter by city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                placeholder="Filter by state"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="createdAt">Date Created</option>
                <option value="fullName">Name</option>
                <option value="schoolName">School Name</option>
                <option value="schoolCity">City</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Operations */}
      {selectedAdmins.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-blue-800 font-medium">
              {selectedAdmins.length} admin{selectedAdmins.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('active')}
                className="flex items-center bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
              >
                <FaCheck className="mr-2" />
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('inactive')}
                className="flex items-center bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 transition"
              >
                <FaBan className="mr-2" />
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full table-auto text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-900 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 border">
                <input
                  type="checkbox"
                  checked={paginatedAdmins.length > 0 && paginatedAdmins.every(admin => selectedAdmins.includes(admin._id))}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-3 py-2 border">Photo</th>
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">School</th>
              <th className="px-3 py-2 border">Contact</th>
              <th className="px-3 py-2 border">City</th>
              <th className="px-3 py-2 border">State</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Created</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdmins.length > 0 ? (
              paginatedAdmins.map((admin) => (
                <tr
                  key={admin._id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedAdmins.includes(admin._id)}
                      onChange={() => handleSelectAdmin(admin._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    {admin.image?.url ? (
                      <img
                        src={admin.image.url}
                        alt="admin"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium">{admin.fullName}</td>
                  <td className="px-3 py-2">{admin.email}</td>
                  <td className="px-3 py-2">{admin.schoolName}</td>
                  <td className="px-3 py-2">{admin.contact || "—"}</td>
                  <td className="px-3 py-2">{admin.schoolCity || "—"}</td>
                  <td className="px-3 py-2">{admin.schoolState || "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      admin.status === 'active'
                        ? 'text-green-800 bg-green-100'
                        : 'text-red-800 bg-red-100'
                    }`}>
                      {admin.status || 'active'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(admin._id)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                        title="Edit Admin"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this admin?')) {
                            // Add delete functionality here
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition p-1"
                        title="Delete Admin"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {displayPageCount > 1 && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={displayPageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName={"flex flex-wrap justify-center gap-2"}
            activeClassName={"text-white bg-blue-500 px-3 py-1 rounded"}
            pageClassName={
              "px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
            }
            previousClassName={
              "px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
            }
            nextClassName={
              "px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
            }
            breakClassName={"px-3 py-1 text-gray-500"}
          />
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;

// Utility function
const downloadCSV = (admins) => {
  const csvRows = [];

  // Headers
  const headers = [
    "Full Name",
    "Email",
    "Password",
    "School",
    "Contact",
    "City",
    "State",
    "Pincode",
    "Created Date",
  ];
  csvRows.push(headers.join(","));

  // Data
  admins.forEach((admin) => {
    const row = [
      admin.fullName,
      admin.email,
      admin.password || "",
      admin.schoolName,
      admin.contact || "",
      admin.schoolCity || "",
      admin.schoolState || "",
      admin.pincode || "",
      new Date(admin.createdAt).toLocaleDateString("en-IN"),
    ];
    csvRows.push(row.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "admin_list.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

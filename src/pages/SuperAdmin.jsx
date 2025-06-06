import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import ReactPaginate from "react-paginate";
import { FaSchool, FaTimes } from "react-icons/fa";

const SuperAdmin = () => {
  const [superId, setSuperID] = useState();
  const [allAdmin, setAllAdmin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
        setPageCount(Math.ceil(data.admins.length / itemsPerPage));
      }
    } catch (error) {
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
  const filteredAdmins = allAdmin.filter((admin) =>
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
    setEditId(null);
  };

  const handleEdit = async (adminId) => {
    try {
      const { data } = await api.get(`/superAdmin/getAdmin/${adminId}`);
      setFormData(data.admin);
      setIsUpdate(true);
      setEditId(adminId);
      setShowModal(true);
    } catch (error) {
      setError("Failed to fetch admin details.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-2xl rounded-xl mt-6">
      {/* Create Admin / Update Admin Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Super Admin Dashboard
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300"
        >
          <FaSchool className="mr-2 text-lg sm:text-xl" />
          Create Admin
        </button>
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
                  setEditId(null);
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

      {/* Search and CSV */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full sm:w-1/3"
        />
        <button
          onClick={() => downloadCSV(filteredAdmins)}
          className="flex items-center bg-green-500 text-white px-3 py-2 rounded shadow hover:bg-green-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 2a1 1 0 00-1 1v8H4l4 4 4-4H9V3a1 1 0 00-1-1z" />
            <path d="M3 13a1 1 0 011-1h12a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3z" />
          </svg>
          Download CSV
        </button>
      </div>

      {/* Admin Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full table-auto text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-900 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 border">Photo</th>
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Password</th>
              <th className="px-3 py-2 border">School</th>
              <th className="px-3 py-2 border">Contact</th>
              <th className="px-3 py-2 border">City</th>
              <th className="px-3 py-2 border">State</th>
              <th className="px-3 py-2 border">Pincode</th>
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
                  <td className="px-3 py-2">{admin.fullName}</td>
                  <td className="px-3 py-2">{admin.email}</td>
                  <td className="px-3 py-2 text-rose-600 font-semibold">
                    {admin.password || "N/A"}
                  </td>
                  <td className="px-3 py-2">{admin.schoolName}</td>
                  <td className="px-3 py-2">{admin.contact || "—"}</td>
                  <td className="px-3 py-2">{admin.schoolCity || "—"}</td>
                  <td className="px-3 py-2">{admin.schoolState || "—"}</td>
                  <td className="px-3 py-2">{admin.pincode || "—"}</td>
                  <td className="px-3 py-2">
                    {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleEdit(admin._id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Admin"
                    >
                      ✏️
                    </button>
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

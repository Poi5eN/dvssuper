import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import ReactPaginate from "react-paginate";

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

  useEffect(() => {
    if (user?.superAdminId) {
      setSuperID(user.superAdminId);
      setFormData((prev) => ({ ...prev, superAdminId: user.superAdminId }));
      fetchAdmin(user.superAdminId, currentPage);
    }
  }, [currentPage]);

  const fetchAdmin = async (superAdminId, page) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/superAdmin/getAdmins/${superAdminId}?page=${page}`
      );
      if (data?.admins) {
        setAllAdmin(data.admins);
        setPageCount(data.totalPages);
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
  };

  const filteredAdmins = allAdmin.filter((admin) =>
    admin.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        fetchAdmin(formData.superAdminId, currentPage);
        resetForm();
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
    } catch (error) {
      setError("Failed to fetch admin details.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-xl mt-6">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        {isUpdate ? "Update Admin" : "Create New Admin"}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 text-center font-medium">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
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
              required={["email", "password", "schoolName"].includes(name)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              rows={3}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="col-span-full text-center mt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300"
            disabled={loading}
          >
            {loading
              ? isUpdate
                ? "Updating Admin..."
                : "Creating Admin..."
              : isUpdate
              ? "Update Admin"
              : "Create Admin"}
          </button>
        </div>
      </form>

      {/* Search and CSV */}
      <div className="flex justify-between items-center my-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={() => downloadCSV(filteredAdmins)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        >
          Download CSV
        </button>
      </div>

      {/* Admin Table */}
      <div className="overflow-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1000px] w-full table-auto text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-900 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border">Photo</th>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border">Password</th>
              <th className="px-4 py-3 border">School</th>
              <th className="px-4 py-3 border">Contact</th>
              <th className="px-4 py-3 border">City</th>
              <th className="px-4 py-3 border">State</th>
              <th className="px-4 py-3 border">Pincode</th>
              <th className="px-4 py-3 border">Created</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr
                  key={admin._id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="px-4 py-2">
                    {admin.image?.url ? (
                      <img
                        src={admin.image.url}
                        alt="admin"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{admin.fullName}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2 text-rose-600 font-semibold">
                    {admin.password || "N/A"}
                  </td>
                  <td className="px-4 py-2">{admin.schoolName}</td>
                  <td className="px-4 py-2">{admin.contact || "—"}</td>
                  <td className="px-4 py-2">{admin.schoolCity || "—"}</td>
                  <td className="px-4 py-2">{admin.schoolState || "—"}</td>
                  <td className="px-4 py-2">{admin.pincode || "—"}</td>
                  <td className="px-4 py-2">
                    {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(admin._id)}
                      className="text-blue-600 hover:text-blue-800"
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
                  colSpan="10"
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
      <div className="mt-6 flex justify-center">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex gap-2"}
          activeClassName={"text-white bg-blue-500 px-3 py-1 rounded"}
          pageClassName={"px-3 py-1 rounded border"}
          previousClassName={"px-3 py-1 rounded border"}
          nextClassName={"px-3 py-1 rounded border"}
          breakClassName={"px-3 py-1"}
        />
      </div>
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

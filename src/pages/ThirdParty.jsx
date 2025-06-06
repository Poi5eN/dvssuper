import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/axiosInstance";
import ReactPaginate from "react-paginate";
import { FaUserPlus, FaTimes, FaSchool } from "react-icons/fa";

const ThirdParty = () => {
  const [superId, setSuperID] = useState("");
  const [thirdParty, setThirdParty] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [school, setSchool] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    superAdminId: "",
    assignedSchools: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.superAdminId) {
      setSuperID(user.superAdminId);
      setFormData((prev) => ({
        ...prev,
        superAdminId: user.superAdminId,
      }));
      fetchAdmin(user.superAdminId);
      fetchThirdParty(user.superAdminId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThirdParty = async (superAdminId) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/superAdmin/thirdparty/${superAdminId}`
      );
      if (data?.thirdPartyUsers) {
        console.log("Third-party users fetched:", data.thirdPartyUsers); // Debugging
        setThirdParty(data.thirdPartyUsers);
      }
    } catch (err) {
      setError("Failed to fetch third-party users.");
      console.error("Fetch third-party error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmin = async (superAdminId) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/superAdmin/getAdmins/${superAdminId}`
      );
      if (data?.admins) setAdmin(data.admins);
    } catch (err) {
      setError("Failed to fetch admin list.");
      console.error("Fetch admin error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const assignedSchools = selectedOptions.map((option) => ({
      schoolId: option.value,
      schoolName: option.label,
    }));
    setSchool(assignedSchools);
    setFormData((prev) => ({ ...prev, assignedSchools }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("superAdminId", formData.superAdminId);
      if (image) payload.append("image", image);
      payload.append(
        "assignedSchools",
        JSON.stringify(formData.assignedSchools)
      );

      const response = await api.post(
        "/superAdmin/createThirdParty",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.success) {
        alert("Third-Party User Created Successfully!");
        await fetchThirdParty(formData.superAdminId);
        resetForm();
        setShowModal(false);
      }
    } catch (err) {
      console.error(
        "Error creating third-party user:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      superAdminId: superId,
      assignedSchools: [],
    });
    setImage(null);
    setSchool([]);
  };

  const adminOptions = admin.map((val) => ({
    value: val.schoolId,
    label: val.schoolName,
  }));

  // Pagination logic
  const pageCount = Math.ceil(thirdParty.length / itemsPerPage);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const paginatedThirdParty = thirdParty.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-2xl rounded-xl mt-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Third-Party User Management
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg hover:from-green-700 hover:to-teal-700 transition duration-300"
        >
          <FaUserPlus className="mr-2 text-lg sm:text-xl" />
          Create Third-Party
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Create Third-Party User
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
                title="Close Modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-full sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
              </div>

              {/* Assigned Schools */}
              <div className="col-span-full">
                <label className="block text-gray-700 font-semibold mb-1">
                  Assigned Schools
                </label>
                <Select
                  options={adminOptions}
                  isMulti
                  onChange={handleMultiSelectChange}
                  placeholder={
                    <>
                      <FaSchool className="inline-block mr-1 text-teal-500" />
                      Select Schools
                    </>
                  }
                  value={adminOptions.filter((option) =>
                    formData.assignedSchools.some(
                      (school) => school.schoolId === option.value
                    )
                  )}
                  className="w-full"
                />
              </div>

              {/* Submit */}
              <div className="col-span-full text-center mt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:from-green-700 hover:to-teal-700 transition duration-300 inline-flex items-center"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Third-Party Users Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Third-Party Users List</h3>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full table-auto text-sm text-gray-800">
            <thead className="bg-gradient-to-r from-green-50 to-teal-100 text-teal-900 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 border min-w-[80px]">Photo</th>
                <th className="px-3 py-2 border min-w-[120px]">Name</th>
                <th className="px-3 py-2 border min-w-[200px]">Email</th>
                <th className="px-3 py-2 border min-w-[120px]">Password</th>
                <th className="px-3 py-2 border min-w-[200px]">Schools</th>
                <th className="px-3 py-2 border min-w-[150px]">Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-gray-500 font-medium"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedThirdParty.length > 0 ? (
                paginatedThirdParty.map((val) => (
                  <tr
                    key={val._id}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="px-3 py-2">
                      {val.image?.url ? (
                        <img
                          src={val.image.url}
                          alt="avatar"
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">{val.name}</td>
                    <td className="px-3 py-2">{val.email}</td>
                    <td className="px-3 py-2 text-rose-600 font-semibold">
                      {val.password || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {val.assignedSchools
                        ?.map((school) => school.schoolName)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-3 py-2">{val.address || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-gray-500 font-medium"
                  >
                    No Third-Party Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-6 flex justify-center">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName={"flex flex-wrap justify-center gap-2"}
              activeClassName={"text-white bg-teal-500 px-3 py-1 rounded"}
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
    </div>
  );
};

export default ThirdParty;







// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import api from '../api/axiosInstance'; // Ensure correct Axios instance path

// const ThirdParty = () => {
//   // State for Form and Admin List
//   const [superId, setSuperID] = useState('');
//   const [thirdParty, setThirdParty] = useState([]);
//   const [admin, setAdmin] = useState([]);
//   const [school, setSchool] = useState([]);
//   console.log("school",school)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     superAdminId: '',
//     assignedSchools: [],

//   });

//   // State for loading and error handling
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Extract superAdminId from localStorage on mount
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user?.superAdminId) {
//       fetchAdmin(user.superAdminId); // Fetch Admins
//       fetchThirdParty(user.superAdminId); // Fetch Third-Party Users
//       setSuperID(user.superAdminId);
//       setFormData((prev) => ({ ...prev, superAdminId: user.superAdminId }));
//     }
//   }, []);

//   // Fetch Third-Party Users (GET Request)
//   const fetchThirdParty = async (superAdminId) => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/superAdmin/thirdparty/${superAdminId}`);
//       if (data?.thirdPartyUsers) setThirdParty(data.thirdPartyUsers);
//     } catch (error) {
//       console.error('Error fetching third-party users:', error);
//       setError('Failed to fetch third-party users.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Admin List (GET Request)
//   const fetchAdmin = async (superAdminId) => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/superAdmin/getAdmins/${superAdminId}`);
//       if (data?.admins) setAdmin(data.admins);
//     } catch (error) {
//       console.error('Error fetching admins:', error);
//       setError('Failed to fetch admin list.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle Multi-Select Changes (react-select)
//   // const handleMultiSelectChange = (selectedOptions) => {
//   //   const selectedSchoolIds = selectedOptions.map((option) => option.value);
//   //   console.log("selectedSchoolIds",selectedSchoolIds)
//   //   setFormData((prev) => ({ ...prev, assignedSchools: selectedSchoolIds }));
//   // };

//   const handleMultiSelectChange = (selectedOptions) => {
//     const assignedSchools = selectedOptions.map((option) => ({
//       schoolId: option.value,
//       schoolName: option.label,
//     }));
//     // console.log("selectedSchoolIds",assignedSchools)
// setSchool(assignedSchools)
//     setFormData((prev) => ({ ...prev, assignedSchools }));
//   };

//   console.log("formData",formData)
//   // Handle Form Submission (Create Third-Party User)
//   const handleSubmit = async (e) => {
//     const payload={ 
//       name: formData?.name,
//       email:formData?.email,
//       password: formData?.password,
//       superAdminId:formData?.superAdminId ,
//       assignedSchools: school  
//     }
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await api.post('/superAdmin/createThirdParty', payload);
//       if (response?.data?.success) {
//         alert('Third-Party User Created Successfully!');
//         fetchThirdParty(formData.superAdminId);
//         resetForm();
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error?.response?.data?.message || 'Failed to process request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset Form (Clear Inputs but Keep superAdminId)
//   const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       address: '',
//       superAdminId: superId,
//       assignedSchools: [],
//     });
//   };

//   // Map Admins for react-select options
//   const adminOptions = admin.map((val) => ({
//     value: val.schoolId,
//     label: val.schoolName,
//   }));

//   return (
//     <div className="p-6 rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Create Third-Party User</h2>

//       {/* Error Message */}
//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Admin Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

//         {/* Name Input */}
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* Email Input */}
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Enter Email"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* Password Input */}
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Enter Password"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* Multi-Select Dropdown (react-select) */}
//         <div className="col-span-full">
//           <Select
//             options={adminOptions}
//             isMulti
//             onChange={handleMultiSelectChange}
//             placeholder="Select Schools"
//             className="w-full"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? 'Creating User...' : 'Create Third-Party User'}
//         </button>
//       </form>

//       {/* Third-Party Users List */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">Third-Party Users List</h3>
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2">Name</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">Assigned Schools</th>
//               <th className="p-2">Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {thirdParty.length > 0 ? (
//               thirdParty.map((val) => (
//                 <tr key={val._id} className="border-b">
//                   <td className="p-2">{val.name}</td>
//                   <td className="p-2">{val.email}</td>
//                   <td className="p-2">
//                     {val.assignedSchools
//                       .map((school) => school.schoolName)
//                       .join(', ')}
//                   </td>
//                   <td className="p-2">{val.address}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center">
//                   No Third-Party Users Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ThirdParty;



// import { useState, useEffect } from 'react';
// import api from '../api/axiosInstance'; // Ensure correct Axios instance path

// const ThirdParty = () => {
//   // State for Form and Admin List
//   const [superId, setSuperID] = useState('');
//   const [thirdParty, setThirdParty] = useState([]);
//   const [admin, setAdmin] = useState([]);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     address: '',
//     schoolName: '',
//     superAdminId: '',
//   });
// console.log("admin",admin)
//   // State for loading and error handling
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Extract superAdminId from localStorage on mount
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user?.superAdminId) {
//       fetchAdmin(user.superAdminId); // Fetch Admins
//       setSuperID(user.superAdminId);
//       setFormData((prev) => ({ ...prev, superAdminId: user.superAdminId }));
//       fetchThirdParty(user.superAdminId); // Fetch Admins
     
//     }
//   }, []);

//   // Fetch Admin List (GET Request)
//   const fetchThirdParty = async (superAdminId) => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/superAdmin/thirdparty/${superAdminId}`);
//       console.log("thirdparty",data)
//       if (data?.thirdPartyUsers) setThirdParty(data.thirdPartyUsers);
//     } catch (error) {
//       console.error('Error fetching admin:', error);
//       setError('Failed to fetch admin list.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchAdmin = async (superAdminId) => {
//     console.log("fetchAdmin1")
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/superAdmin/getAdmins/${superAdminId}`);
//       console.log("fetchAdmin",data?.admins)
//       if (data?.admins) {
//         setAdmin(data.admins);
//       }
//     } catch (error) {
//       console.error('Error fetching admin:', error);
//       setError('Failed to fetch admin list.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle Form Submission (Create Admin)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await api.post('/superAdmin/createThirdParty', formData);
//       if (response?.data?.success) {
//         alert('Admin Created Successfully!');
//         fetchThirdParty(formData.superAdminId);
//         resetForm();
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error?.response?.data?.message || 'Failed to process request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset Form (Clear Inputs but Keep superAdminId)
//   const resetForm = () => {
//     setFormData({
//       fullName: '',
//       email: '',
//       password: '',
//       address: '',
//       schoolName: '',
//       superAdminId: superId,
//     });
//   };

//   return (
//     <div className="p-6 rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Create Admin</h2>

//       {/* Error Message */}
//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Admin Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

//         {/* Name Input */}
//         <input
//           type="text"
//           name="fullName"
//           value={formData.fullName}
//           onChange={handleChange}
//           placeholder="Admin Name"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* Email Input */}
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Enter Email"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Enter Password"
//           required
//           className="w-full p-2 border rounded"
//         />
// <select name="admin" id="admin">
//   {admin?.map((val)=> <option value={val?.schoolId}>{val?.schoolName}</option>)}
// </select>

//         <input
//           type="text"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           placeholder="Enter Address"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* School Name Input */}
//         <input
//           type="text"
//           name="schoolName"
//           value={formData.schoolName}
//           onChange={handleChange}
//           placeholder="Enter School Name"
//           required
//           className="w-full p-2 border rounded"
//         />

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? 'Creating Admin...' : 'Create Admin'}
//         </button>
//       </form>

//       {/* Admin List */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">Admin List</h3>
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2">Name</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">School Name</th>
//               <th className="p-2">Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* {console.log("thirdParty",thirdParty)} */}
//             {thirdParty.length > 0 ? (
//               thirdParty.map((val,ind) => (
//                 <tr key={val._id} className="border-b">
//                   <td className="p-2">{val.name}</td>
//                   <td className="p-2">{val.email}</td>
//                   <td className="p-2">{val.assignedSchools?.map((value)=>value?.schoolName)}</td>
//                   <td className="p-2">{val.address}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center">No Admins Found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ThirdParty;


// const ThirdParty = ({ data }) => {
//     return (
//       <div className="bg-yellow-200 p-4 rounded-lg">
//         <h2 className="text-2xl font-semibold mb-2">Third Party Panel</h2>
//         <p>{data}</p>
//       </div>
//     );
//   };
  
//   export default ThirdParty;
  
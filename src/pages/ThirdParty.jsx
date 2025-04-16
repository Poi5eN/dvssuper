import { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../api/axiosInstance';

const ThirdParty = () => {
  const [superId, setSuperID] = useState('');
  const [thirdParty, setThirdParty] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [school, setSchool] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    superAdminId: '',
    assignedSchools: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.superAdminId) {
      fetchAdmin(user.superAdminId);
      fetchThirdParty(user.superAdminId);
      setSuperID(user.superAdminId);
      setFormData((prev) => ({ ...prev, superAdminId: user.superAdminId }));
    }
  }, []);

  const fetchThirdParty = async (superAdminId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/superAdmin/thirdparty/${superAdminId}`);
      if (data?.thirdPartyUsers) setThirdParty(data.thirdPartyUsers);
    } catch (error) {
      setError('Failed to fetch third-party users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmin = async (superAdminId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/superAdmin/getAdmins/${superAdminId}`);
      if (data?.admins) setAdmin(data.admins);
    } catch (error) {
      setError('Failed to fetch admin list.');
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
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('superAdminId', formData.superAdminId);
      if (image) payload.append('image', image);
      // Stringify the assignedSchools array
      payload.append('assignedSchools', JSON.stringify(formData.assignedSchools));

      const response = await api.post('/superAdmin/createThirdParty', payload, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set, though Axios usually handles this
        },
      });

      if (response?.data?.success) {
        alert('Third-Party User Created Successfully!');
        fetchThirdParty(formData.superAdminId);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating third-party user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      superAdminId: superId,
      assignedSchools: [],
    });
    setImage(null);
    setSchool([]); // Reset school state as well
  };

  const adminOptions = admin.map((val) => ({
    value: val.schoolId,
    label: val.schoolName,
  }));

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Third-Party User</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />

        <div className="col-span-full">
          <Select
            options={adminOptions}
            isMulti
            onChange={handleMultiSelectChange}
            placeholder="Select Schools"
            value={adminOptions.filter((option) =>
              formData.assignedSchools.some((school) => school.schoolId === option.value)
            )} // Sync with formData.assignedSchools
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating User...' : 'Create Third-Party User'}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Third-Party Users List</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Assigned Schools</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {thirdParty.length > 0 ? (
              thirdParty.map((val) => (
                <tr key={val._id} className="border-b">
                  <td className="p-2">{val.name}</td>
                  <td className="p-2">{val.email}</td>
                  <td className="p-2">
                    {val.assignedSchools
                      .map((school) => school.schoolName)
                      .join(', ')}
                  </td>
                  <td className="p-2">{val.address}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No Third-Party Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  
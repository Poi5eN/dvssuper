import axios from 'axios';

// Create Axios instance with Vite environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Access Vite env variable
  header  :"multipart/form-data" 
  
  // headers: {
  //   'Content-Type': 'multipart/form-data',
  //   // 'Content-Type': 'application/json',
  // },
});

// Automatically add JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://your-api-url.com/api', // Replace with your API base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to headers if available (for protected routes)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

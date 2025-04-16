import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SuperAdmin from './pages/SuperAdmin';
import ThirdParty from './pages/ThirdParty';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="superadmin" element={<SuperAdmin />} />
          <Route path="thirdparty" element={<ThirdParty />} />
        </Route>

        {/* Catch-All Route (Redirect to Login) */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';

// import Login from './pages/Login';
// import SuperAdmin from './pages/SuperAdmin';
// import ThirdParty from './pages/ThirdParty';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route path="/superadmin" element={<SuperAdmin />} />
//           <Route path="thirdparty" element={<ThirdParty />} />
//         </Route>
//         <Route path="*" element={<Login />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="*" element={<Login />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

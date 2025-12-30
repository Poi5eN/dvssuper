import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/Dashboard"; // User's dashboard file
import SuperAdmin from "./pages/SuperAdmin";
import ThirdParty from "./pages/ThirdParty";
import Login from "./pages/Login";
import Schools from "./pages/Schools";
import Reports from "./pages/Reports";
import SuperAdminAlerts from "./components/AlertManagement/SuperAdminAlerts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Main Dashboard Home */}
          <Route index element={<DashboardHome />} />
          {/* Sub-pages */}
          <Route path="superadmin" element={<SuperAdmin />} />
          <Route path="schools" element={<Schools />} />
          <Route path="admins" element={<SuperAdmin />} />{" "}
          {/* Alias for Admins */}
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<SuperAdminAlerts />} />
          <Route path="thirdparty" element={<ThirdParty />} />
        </Route>

        {/* Catch-All Route (Redirect to Login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
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

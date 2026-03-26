import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import CoderDashboard from './pages/coder/CoderDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

/**
 * Main Application Routing
 * Each role is assigned a unique base path to prevent Route collisions.
 */
function App() {
  const { user } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - Move these OUTSIDE any ProtectedRoute wrapper */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['coder', 'gestor']} />}>
          <Route path="/dashboard" element={user?.role === 'gestor' ? <AdminDashboard /> : <CoderDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'gestor']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Redirect unknown to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


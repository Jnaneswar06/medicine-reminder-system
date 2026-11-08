import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlarmProvider } from './context/AlarmContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddMedicinePage from './pages/AddMedicinePage';
import EditMedicinePage from './pages/EditMedicinePage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import ProfilePage from './pages/ProfilePage';
import './styles/index.css';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/medicines/add" element={<AddMedicinePage />} />
            <Route path="/medicines/edit/:id" element={<EditMedicinePage />} />
            <Route path="/medicines/:id" element={<MedicineDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <AlarmProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<Layout />} />
            </Route>
          </Routes>
        </Router>
      </AlarmProvider>
    </AuthProvider>
  );
}

export default App;

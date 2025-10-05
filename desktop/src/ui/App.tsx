import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LayoutPage from './pages/Layout.page.tsx';
import MainPage from './pages/Main/Main.page.tsx';
import LoginPage from './pages/Login/Login.page.tsx';
import SecretsPage from './pages/Secrets/Secrets.page.tsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('token', 'fake-jwt-token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  };

  const LoginRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LayoutPage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<MainPage />} />
        <Route path="/secrets" element={<SecretsPage />} />
        <Route path="techniques" element={<div>Techniques Page</div>} />
      </Route>

      <Route
        path="/login"
        element={
          <LoginRoute>
            <LoginPage onLogin={handleLogin} />
          </LoginRoute>
        }
      />
    </Routes>
  );
}

export default App;

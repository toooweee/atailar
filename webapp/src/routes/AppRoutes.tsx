import React from 'react';
import LoginPage from '../components/pages/loginPage.tsx';
import { Route, Routes } from 'react-router-dom';
import AdminPage from '../components/pages/AdminPage.tsx';
const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;

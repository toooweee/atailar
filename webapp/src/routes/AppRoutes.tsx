import React from 'react';
import LoginPage from '../components/pages/Admin/loginPage.tsx';
import { Route, Routes } from 'react-router-dom';
import AdminPage from '../components/pages/AdminPage.tsx';
import UserPage from '../components/pages/UserPage.tsx';

const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user" element={<UserPage />} />
      {/*<Route path="/admin/users" element={<UsersPage />} />*/}
      {/*<Route path="/admin/dashboard" element={<RequestPage />} />*/}
      {/*<Route path="admin/audit" element={<AuditPage />} />*/}
    </Routes>
  );
};

export default AppRoutes;

import React from 'react';
import LoginPage from '../components/pages/loginPage.tsx';
import { Route, Routes } from 'react-router-dom';
import AdminPage from '../components/pages/AdminPage.tsx';

const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      {/*<Route path="/admin/users" element={<UsersPage />} />*/}
      {/*<Route path="/admin/dashboard" element={<RequestPage />} />*/}
      {/*<Route path="admin/audit" element={<AuditPage />} />*/}
    </Routes>
  );
};

export default AppRoutes;

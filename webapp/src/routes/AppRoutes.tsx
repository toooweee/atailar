import React from 'react';
import LoginPage from '../components/pages/loginPage.tsx';
import { Route, Routes } from 'react-router-dom';
const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;

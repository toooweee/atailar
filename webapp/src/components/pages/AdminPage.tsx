import { getCurrentRole } from '../../utils/tokenAndRoleUtils.ts';
import { type ReactNode, useEffect, useState } from 'react';
import { Roles } from '../../api/auth/types/eunms/Roles.ts';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import UserPage from './Admin/UsersPage.tsx';
import RequestPage from './Admin/RequestPage.tsx';
import AuditPage from './Admin/AuditPage.tsx';
import { authApi } from '../../api/auth/AuthApi.ts';

const AdminPage = () => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<ReactNode>(undefined);

  const role = getCurrentRole();

  useEffect(() => {
    if (role !== Roles.ADMIN)
      navigate('/login');
  }, []);

  const logout = async () => {
    setCurrentTab(undefined);
    const response = await authApi.logout();
    if(response?.success)
      navigate('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Админ-панель
          </Typography>
          <Button color="inherit" onClick={() => setCurrentTab(<UserPage />)}>
            Управление пользователями
          </Button>
          <Button color="inherit" onClick={() => setCurrentTab(<RequestPage />)}>
            Управление заявками
          </Button>
          <Button color="inherit" onClick={() => setCurrentTab(<AuditPage />)}>
            Аудит
          </Button>
          <Button color="inherit" onClick={() => logout()}>
            Выйти из системы
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {currentTab}
      </Box>
    </Box>
  );
};

export default AdminPage;

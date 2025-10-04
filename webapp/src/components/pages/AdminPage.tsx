import { getCurrentRole } from '../../utils/tokenAndRoleUtils.ts';
import { useEffect } from 'react';
import { Roles } from '../../api/auth/types/eunms/Roles.ts';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

const AdminPage = () => {
  const navigate = useNavigate();

  const role = getCurrentRole();

  useEffect(() => {
    if(role !== Roles.ADMIN)
      navigate('/login')
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Админ-панель
          </Typography>
          <Button color="inherit" component={Link} to="/admin/users">
            Управление пользователями
          </Button>
          <Button color="inherit" component={Link} to="/admin/dashboard">
            Управление заявками
          </Button>
          <Button color="inherit" component={Link} to="admin/audit">
            Аудит
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {/* Здесь будут роуты или контент админ-панели, e.g., Outlet из react-router */}
        <Typography variant="h4">
          Добро пожаловать в админ-панель. Выберите раздел в меню выше.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminPage;

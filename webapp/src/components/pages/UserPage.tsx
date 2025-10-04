import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Container,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assignment as RequestsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCurrentRole } from '../../utils/tokenAndRoleUtils.ts';
import { Roles } from '../../api/auth/types/eunms/Roles.ts';
import { authApi } from '../../api/auth/AuthApi.ts';
import RequestCreateForm from '../components/request/RequestCreateForm.tsx';
import UserRequestsList from '../components/request/UserRequestsList.tsx';
import UserSecretsList from '../components/secret/UserSecretsList.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const role = getCurrentRole();

  useEffect(() => {
    if (role !== Roles.USER) {
      navigate('/login');
      return;
    }

    const loadUserInfo = async () => {
      try {
        const info = await authApi.getMeInformation();
        setUserInfo(info);
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };

    loadUserInfo();
  }, [role, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setShowCreateForm(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await authApi.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateRequest = () => {
    setShowCreateForm(true);
    setCurrentTab(1)
  };

  const handleRequestCreated = () => {
    setShowCreateForm(false);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  if (role !== Roles.USER) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <SecurityIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Система управления секретами
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Уведомления">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Chip
              icon={<PersonIcon />}
              label={userInfo?.email || 'Пользователь'}
              variant="outlined"
              color='default'
              onClick={handleMenuOpen}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ mr: 1 }} />
                Настройки
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Выйти
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500
                }
              }}
            >
              <Tab
                icon={<SecurityIcon />}
                label="Мои секреты"
                iconPosition="start"
              />
              <Tab
                icon={<RequestsIcon />}
                label="Мои заявки"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            {showCreateForm ? (
              <RequestCreateForm
                onSuccess={handleRequestCreated}
                onCancel={handleCancelCreate}
              />
            ) : (
              <UserSecretsList onCreateRequest={handleCreateRequest} />
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {showCreateForm ? (
              <RequestCreateForm
                onSuccess={handleRequestCreated}
                onCancel={handleCancelCreate}
              />
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h1">
                    Управление заявками
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<RequestsIcon />}
                    onClick={handleCreateRequest}
                    size="large"
                  >
                    Создать заявку
                  </Button>
                </Box>
                <UserRequestsList />
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserPage;

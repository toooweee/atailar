import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import UsersTable from '../components/users/UsersTable.tsx';
import UserForm from '../components/users/UserForm.tsx';
import { usersApi } from '../../api/users/UsersApi.ts';
import type { UserInfo } from '../../api/users/types/response/UserInfo.ts';
import { useLoading } from '../../hooks/useLoading.ts';
import { useSnackbar } from '../../contexts/SnackbarProvider.tsx';

const UserPage = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { loading, withLoading } = useLoading();
  const { showMessage } = useSnackbar();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await withLoading(() => usersApi.findAllUsers());
        if (data && data.length > 0) {
          setUsers(data);
        }
      } catch (err: any) {
        showMessage({message: err.toString(), severity: 'error'});
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (fullName: string, email: string): Promise<UserInfo | null> => {
    try {
      const newUser = await withLoading(() => usersApi.createUser({ email: email, fullName: fullName }));
      if (newUser) {
        setUsers((prev) => [...prev, newUser]);
        showMessage({ message: 'Пользователь создан успешно', severity: 'success' });
        return newUser;
      }
      return null;
    } catch (err: any) {
      const msg = err.toString();
      setFormError(msg);
      showMessage({message: msg, severity: 'error'});
      return null;
    }
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
    setFormError(null);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setFormError(null);
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Управление пользователями
        </Typography>
        <Button variant="contained" onClick={handleOpenCreateModal}>
          Создать пользователя
        </Button>
      </Box>
      <UsersTable users={users} />
      <UserForm
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={addUser}
        loading={loading}
        error={formError || undefined}
      />
    </Container>
  );
};

export default UserPage;

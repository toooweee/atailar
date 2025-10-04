import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Container, Avatar } from '@mui/material';
import { useSnackbar } from '../../contexts/SnackbarProvider.tsx';
import type { LoginRequest } from '../../api/auth/types/request/LoginRequest.ts';
import { authApi } from '../../api/auth/AuthApi.ts';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();

  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authApi.login(form);
      if (data)
        switch (data) {
          case 'Admin':
            navigate('/admin');
            break;
          case 'User':
            navigate('/client');
            break;
          default:
            navigate('/');
        }
      else showMessage({
        message: 'Произошла ошибка при входе',
        severity: 'error',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 200, height: 200 }}>
          <img src="../../../public/logo.png" alt="Logo" style={{ width: '100%', height: '100%' }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
            width: '100%',
            maxWidth: 400,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Email пользователя"
            name="userName"
            autoComplete="email"
            autoFocus
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;

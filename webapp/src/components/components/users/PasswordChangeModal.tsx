// src/components/users/PasswordChangeModal.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordChangeModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onSubmit: (userId: string, newPassword: string) => Promise<boolean>;
  loading?: boolean;
  error?: string;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
                                                                   open,
                                                                   userId,
                                                                   onClose,
                                                                   onSubmit,
                                                                   loading = false,
                                                                   error,
                                                                 }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (newPassword !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      setFormError('Пароль должен содержать минимум 8 символов');
      return;
    }
    const success = await onSubmit(userId, newPassword);
    if (success) {
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Сменить пароль для пользователя</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            label="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            fullWidth
            required
            type={showConfirmPassword ? 'text' : 'password'}
            label="Подтвердить пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || !newPassword || !confirmPassword}>
            {loading ? <CircularProgress size={24} /> : 'Сменить пароль'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PasswordChangeModal;

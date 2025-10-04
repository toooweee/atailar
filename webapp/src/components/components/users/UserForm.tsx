// src/components/users/UserForm.tsx
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
} from '@mui/material';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fullName: string, email: string) => Promise<UserInfo | null>;
  loading?: boolean;
  error?: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSubmit, loading = false, error }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = await onSubmit(fullName, email);
    if (newUser) {
      setFullName('');
      setEmail('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать нового пользователя</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            required
            label="Полное имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            required
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || !fullName || !email}>
            {loading ? <CircularProgress size={24} /> : 'Создать'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UserForm;

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (resource: string, justification: string, expirationDate: Date) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const RequestForm: React.FC<RequestFormProps> = ({ open, onClose, onSubmit, loading = false, error }) => {
  const [resource, setResource] = useState('');
  const [justification, setJustification] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default 7 дней
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expirationDate && resource && justification) {
      await onSubmit(resource, justification, expirationDate);
      navigate('/requests/list'); // Редирект на список
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>Создать заявку на доступ</DialogTitle>
  <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
  <DialogContent>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
  <TextField
  fullWidth
  required
  label="Ресурс (например, Production DB)"
  value={resource}
  onChange={(e) => setResource(e.target.value)}
  sx={{ mt: 1 }}
  />
  <TextField
  fullWidth
  required
  multiline
  rows={4}
  label="Обоснование"
  value={justification}
  onChange={(e) => setJustification(e.target.value)}
  sx={{ mt: 2 }}
  />
  <DatePicker
  label="Срок доступа (не более 30 дней)"
  value={expirationDate}
  onChange={setExpirationDate}
  minDate={new Date()}
  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
  slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
  />
  </DialogContent>
  <DialogActions>
  <Button onClick={onClose}>Отмена</Button>
    <Button type="submit" variant="contained" disabled={loading || !expirationDate}>
  {loading ? <CircularProgress size={24} /> : 'Отправить заявку'}
    </Button>
    </DialogActions>
    </Box>
    </Dialog>
    </LocalizationProvider>
  );
  };

  export default RequestForm;

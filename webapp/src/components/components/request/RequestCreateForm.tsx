import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { accessRequestApi } from '../../../api/accessRequest/accessRequestApi.ts';
import type { CreateAccessRequest } from '../../../api/accessRequest/types/request/CreateAccessRequest.ts';

interface RequestCreateFormProps {
  onSuccess?: (request: any) => void;
  onCancel?: () => void;
}

const RequestCreateForm: React.FC<RequestCreateFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateAccessRequest>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.resource.trim()) {
      setError('Пожалуйста, укажите ресурс');
      return false;
    }
    if (!formData.justification.trim()) {
      setError('Пожалуйста, укажите обоснование');
      return false;
    }
    if (formData.justification.trim().length < 10) {
      setError('Обоснование должно содержать минимум 10 символов');
      return false;
    }
    if (formData.expirationDate < new Date()) {
      setError('Дата окончания не может быть в прошлом');
      return false;
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (formData.expirationDate > maxDate) {
      setError('Максимальный срок доступа - 30 дней');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await accessRequestApi.createAccessRequest({
        resource: formData.resource.trim(),
        justification: formData.justification.trim(),
        expirationDate: formData.expirationDate
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(result);
        }, 1500);
      } else {
        setError('Не удалось создать заявку. Попробуйте еще раз.');
      }
    } catch (err) {
      setError('Произошла ошибка при создании заявки');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<SecurityIcon />}
              label="Заявка создана"
              color="success"
              variant="filled"
              sx={{ fontSize: '1.1rem', py: 2, px: 3 }}
            />
          </Box>
          <Typography variant="h6" color="success.main" gutterBottom>
            Заявка на доступ успешно создана!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ваша заявка отправлена на рассмотрение. Вы получите уведомление о результате.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Заявка на доступ к ресурсу
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Заполните форму для подачи заявки на доступ к конфиденциальному ресурсу
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Ресурс"
                placeholder="Например: Production Database, API Keys, etc."
                value={formData.resource}
                onChange={(e) => handleInputChange('resource', e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Укажите название ресурса, к которому требуется доступ"
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Обоснование"
                placeholder="Опишите, зачем вам нужен доступ к этому ресурсу..."
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="Минимум 10 символов. Подробно опишите необходимость доступа"
              />

              <DatePicker
                label="Срок доступа"
                value={formData.expirationDate}
                onChange={(date) => date && handleInputChange('expirationDate', date)}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                    helperText: "Максимальный срок - 30 дней"
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                  size="large"
                >
                  Отмена
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ minWidth: 140 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Подать заявку'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default RequestCreateForm;

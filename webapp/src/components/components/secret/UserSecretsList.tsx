import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Add as AddIcon,
  CheckCircle as AvailableIcon,
  Lock as LockedIcon,
  Schedule as ExpiredIcon
} from '@mui/icons-material';
import { secretApi, type Secret } from '../../../api/secret/secretApi.ts';
import SecretDisplay from './SecretDisplay.tsx';

interface UserSecretsListProps {
  onCreateRequest?: () => void;
}

const UserSecretsList: React.FC<UserSecretsListProps> = ({ onCreateRequest }) => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSecrets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await secretApi.getMySecrets();
      setSecrets(data);
    } catch (err) {
      setError('Не удалось загрузить секреты');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecrets();
  }, []);

  const getStats = () => {
    const available = secrets.filter(s => s.isAccessible && (!s.expiresAt || new Date(s.expiresAt) > new Date())).length;
    const expired = secrets.filter(s => s.expiresAt && new Date(s.expiresAt) < new Date()).length;
    const locked = secrets.filter(s => !s.isAccessible).length;
    
    return { available, expired, locked, total: secrets.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={loadSecrets}>
            Повторить
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Статистика */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Мои секреты ({stats.total})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onCreateRequest && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onCreateRequest}
                  size="small"
                >
                  Новая заявка
                </Button>
              )}
              <Tooltip title="Обновить список">
                <IconButton onClick={loadSecrets} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                <AvailableIcon />
              </Avatar>
              <Typography variant="h6" color="success.main">
                {stats.available}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Доступны
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
                <ExpiredIcon />
              </Avatar>
              <Typography variant="h6" color="error.main">
                {stats.expired}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Истекли
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                <LockedIcon />
              </Avatar>
              <Typography variant="h6" color="warning.main">
                {stats.locked}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Заблокированы
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                <SecurityIcon />
              </Avatar>
              <Typography variant="h6" color="primary.main">
                {stats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Всего
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Список секретов */}
      {secrets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет доступа к секретам
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Подайте заявку на доступ к нужному ресурсу
            </Typography>
            {onCreateRequest && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateRequest}
                size="large"
              >
                Создать заявку
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {secrets.map((secret) => (
            <SecretDisplay 
              key={secret.id}
              secret={secret}
              onSecretRevealed={(revealedSecret) => {
                // Можно добавить логику аудита или уведомлений
                console.log('Secret revealed:', revealedSecret.name);
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserSecretsList;

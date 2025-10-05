import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Avatar
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { accessRequestApi } from '../../../api/accessRequest/accessRequestApi.ts';
import type { AccessRequest } from '../../../api/accessRequest/types/response/AccessRequest.ts';
import { StatusRequest } from '../../../api/accessRequest/types/enums/StatusRequest.ts';

interface UserRequestsListProps {
  onViewDetails?: (request: AccessRequest) => void;
}

const UserRequestsList: React.FC<UserRequestsListProps> = ({ onViewDetails }) => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await accessRequestApi.getMyAccessRequests();
      setRequests(data);
    } catch (err) {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getStatusChip = (status: StatusRequest) => {
    const statusConfig = {
      [StatusRequest.PENDING]: {
        icon: <PendingIcon />,
        color: 'warning' as const,
        label: 'На рассмотрении',
        bgColor: 'rgba(255, 152, 0, 0.1)',
        borderColor: 'rgba(255, 152, 0, 0.3)'
      },
      [StatusRequest.APPROVED]: {
        icon: <ApprovedIcon />,
        color: 'success' as const,
        label: 'Одобрена',
        bgColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 0.3)'
      },
      [StatusRequest.REJECTED]: {
        icon: <RejectedIcon />,
        color: 'error' as const,
        label: 'Отклонена',
        bgColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: 'rgba(244, 67, 54, 0.3)'
      }
    };

    const config = statusConfig[status];

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: `${config.color}.main`
          }
        }}
      />
    );
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm');
  };

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
          <Button color="inherit" size="small" onClick={loadRequests}>
            Повторить
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (requests.length === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            У вас пока нет заявок
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Создайте первую заявку на доступ к ресурсу
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Мои заявки ({requests.length})
        </Typography>
        <Tooltip title="Обновить список">
          <IconButton onClick={loadRequests} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {requests.map((request) => (
            <Card
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SecurityIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {request.comment || 'Заявка на доступ'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Создана: {formatDate(request.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusChip(request.status)}
                    {onViewDetails && (
                      <Tooltip title="Подробнее">
                        <IconButton
                          onClick={() => onViewDetails(request)}
                          color="primary"
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {request.status === StatusRequest.APPROVED && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{
                      p: 2,
                      bgcolor: 'success.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'success.200'
                    }}>
                      <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600, mb: 1 }}>
                        🎉 Заявка одобрена!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ваш доступ к ресурсу предоставлен. Нажмите кнопку ниже для получения секрета.
                      </Typography>
                    </Box>
                  </>
                )}

                {request.status === StatusRequest.REJECTED && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{
                      p: 2,
                      bgcolor: 'error.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'error.200'
                    }}>
                      <Typography variant="body2" color="error.dark" sx={{ fontWeight: 600 }}>
                        Заявка отклонена
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserRequestsList;

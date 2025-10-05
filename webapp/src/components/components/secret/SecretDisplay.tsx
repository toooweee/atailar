import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Fade,
  Snackbar
} from '@mui/material';
import {
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  ContentCopy as CopyIcon,
  Security as SecurityIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { secretApi, type Secret } from '../../../api/secret/secretApi.ts';

interface SecretDisplayProps {
  secret: Secret;
  onSecretRevealed?: (secret: Secret) => void;
}

const SecretDisplay: React.FC<SecretDisplayProps> = ({ secret, onSecretRevealed }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [secretValue, setSecretValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const maskSecret = (value: string) => {
    if (!value) return '••••••••••••••••';
    return '•'.repeat(Math.min(value.length, 16));
  };

  const handleRevealSecret = async () => {
    if (isRevealed && secretValue) {
      setIsRevealed(false);
      setSecretValue(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const value = await secretApi.getSecretValue(secret.id);
      if (value) {
        setSecretValue(value);
        setIsRevealed(true);
        onSecretRevealed?.(secret);
      } else {
        setError('Не удалось получить секрет');
      }
    } catch (err) {
      setError('Произошла ошибка при получении секрета');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!secretValue) return;

    try {
      await navigator.clipboard.writeText(secretValue);
      setCopySuccess(true);

      // Автоматически скрыть секрет через 30 секунд
      setTimeout(() => {
        setIsRevealed(false);
        setSecretValue(null);
      }, 30000);
    } catch (err) {
      setError('Не удалось скопировать в буфер обмена');
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm');
  };

  const getStatusChip = () => {
    if (!secret.isAccessible) {
      return (
        <Chip
          icon={<LockIcon />}
          label="Нет доступа"
          color="error"
          variant="outlined"
          size="small"
        />
      );
    }

    if (secret.expiresAt && new Date(secret.expiresAt) < new Date()) {
      return (
        <Chip
          icon={<ErrorIcon />}
          label="Истек"
          color="error"
          variant="outlined"
          size="small"
        />
      );
    }

    return (
      <Chip
        icon={<SuccessIcon />}
        label="Доступен"
        color="success"
        variant="outlined"
        size="small"
      />
    );
  };

  const isExpired = secret.expiresAt && new Date(secret.expiresAt) < new Date();
  const canReveal = secret.isAccessible && !isExpired;

  return (
    <>
      <Card
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4
          },
          opacity: canReveal ? 1 : 0.7
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SecurityIcon sx={{ color: canReveal ? 'primary.main' : 'text.secondary' }} />
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {secret.name}
                </Typography>
                {secret.description && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {secret.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Создан: {formatDate(secret.createdAt)}
                </Typography>
              </Box>
            </Box>
            {getStatusChip()}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Значение секрета:
            </Typography>
            <Box sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  color: isRevealed ? 'text.primary' : 'text.secondary',
                  letterSpacing: 1
                }}
              >
                {isRevealed ? secretValue : maskSecret(secretValue || '')}
              </Typography>

              {canReveal && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {isRevealed && secretValue && (
                    <Tooltip title="Скопировать">
                      <IconButton
                        onClick={handleCopySecret}
                        size="small"
                        color="primary"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title={isRevealed ? "Скрыть" : "Показать"}>
                    <IconButton
                      onClick={handleRevealSecret}
                      disabled={loading}
                      size="small"
                      color="primary"
                    >
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : isRevealed ? (
                        <HideIcon />
                      ) : (
                        <ShowIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>

          {secret.expiresAt && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Действует до: {formatDate(secret.expiresAt)}
                {isExpired && (
                  <Chip
                    label="Истек"
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            </Box>
          )}

          {!canReveal && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {!secret.isAccessible
                ? 'У вас нет доступа к этому секрету'
                : 'Срок действия секрета истек'
              }
            </Alert>
          )}

          {isRevealed && secretValue && (
            <Fade in={isRevealed}>
              <Alert
                severity="info"
                sx={{ mt: 2 }}
                icon={<UnlockIcon />}
              >
                <Typography variant="body2">
                  <strong>Внимание!</strong> Секрет будет автоматически скрыт через 30 секунд после копирования.
                </Typography>
              </Alert>
            </Fade>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Секрет скопирован в буфер обмена"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
};

export default SecretDisplay;

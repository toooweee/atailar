// src/pages/AuditPage.tsx (отдельная страница для аудита, похожа на вкладку)
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import AuditLogTable from '../components/audit/AuditLogTable';

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/audit
    const fetchLogs = async () => {
      try {
        // const response = await axios.get('/api/audit');
        // setLogs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Аудит-логи
      </Typography>
      <AuditLogTable logs={logs} />
    </Container>
  );
};

export default AuditPage;

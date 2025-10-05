// src/pages/RequestsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestListTable from '../components/Requests/RequestListTable';

const RequestsListPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка GET /api/requests/my
    const fetchRequests = async () => {
      try {
        // const response = await axios.get('/api/requests/my');
        // setRequests(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мои заявки
      </Typography>
      <Button variant="contained" onClick={() => navigate('/requests/create')} sx={{ mb: 2 }}>
        Создать новую заявку
      </Button>
      <RequestListTable requests={requests} loading={loading} />
    </Container>
  );
};

export default RequestsListPage;

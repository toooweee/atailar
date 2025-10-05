// src/pages/RequestsCreatePage.tsx
import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import RequestForm from './RequestForm.tsx';

const RequestsCreatePage: React.FC = () => {
  const [open, setOpen] = useState(true)

  const handleSubmit = async (resource: string, justification: string, expirationDate: Date) => {
    console.log('Creating request:', { resource, justification, expirationDate });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Создать заявку на доступ
        </Typography>
        <RequestForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
};

export default RequestsCreatePage;

// src/components/Requests/RequestListTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import RequestListItem from './RequestListItem';

interface RequestListTableProps {
  requests: Request[];
  loading?: boolean;
  error?: string;
}

const RequestListTable: React.FC<RequestListTableProps> = ({ requests = [], loading = false, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Ошибка загрузки: {error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Мои заявки">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ресурс</TableCell>
            <TableCell>Обоснование</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дата создания</TableCell>
            <TableCell>Срок действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <RequestListItem key={request.id} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestListTable;

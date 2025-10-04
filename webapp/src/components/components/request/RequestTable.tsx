// src/components/Admin/RequestTable.tsx (для админ-панели: таблица всех заявок с approve/reject)
import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Button,
  Chip,
} from '@mui/material';

interface RequestTableProps {
  requests: Request[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, onApprove, onReject, loading = false }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Все заявки">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Пользователь</TableCell> {/* Добавим user_id */}
            <TableCell>Ресурс</TableCell>
            <TableCell>Обоснование</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.userId || 'N/A'}</TableCell> {/* Предполагаем userId в типе */}
              <TableCell>{request.resource}</TableCell>
              <TableCell>{request.justification.substring(0, 50)}...</TableCell>
              <TableCell>
                <Chip label={request.status} color="primary" size="small" />
              </TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onApprove(request.id)}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Одобрить
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onReject(request.id)}
                      disabled={loading}
                    >
                      Отклонить
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;

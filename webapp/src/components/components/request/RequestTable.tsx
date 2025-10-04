// src/components/Admin/RequestTable.tsx (для админ-панели: таблица всех заявок с approve/reject)
import React from 'react';
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { AccessRequest } from '../../../api/accessRequest/types/response/AccessRequest.ts';
import { StatusRequest } from '../../../api/accessRequest/types/enums/StatusRequest.ts';

interface RequestTableProps {
  requests: AccessRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, onApprove, onReject, loading = false }) => {
  if (requests.length === 0) {
    return <Typography>Нет заявок</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Все заявки">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Пользователь</TableCell> {/* Добавим user_id */}
            <TableCell>Комментарий</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Время подачи заявки</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.userId || 'N/A'}</TableCell>
              <TableCell>{request.comment.substring(0, 50)}...</TableCell>
              <TableCell>
                <Chip label={request.status} color="primary" size="small" />
              </TableCell>
              <TableCell>
                {request.status === StatusRequest.PENDING && (
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

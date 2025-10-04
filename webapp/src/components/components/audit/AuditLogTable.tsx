// src/components/Admin/AuditLogTable.tsx (таблица аудит-логов)
import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource?: string;
  timestamp: Date;
}

interface AuditLogTableProps {
  logs: AuditLog[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Аудит-логи">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Пользователь</TableCell>
            <TableCell>Действие</TableCell>
            <TableCell>Ресурс</TableCell>
            <TableCell>Время</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.id}</TableCell>
              <TableCell>{log.userId}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.resource || 'N/A'}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditLogTable;

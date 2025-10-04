import React from 'react';
import {
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';

interface Request {
  id: string;
  resource: string;
  justification: string;
  status: 'pending' | 'approved' | 'provisioned' | 'ready' | 'rejected';
  createdAt: Date;
  expirationDate?: Date;
}

interface RequestListItemProps {
  request: Request;
}

const statusColors: Record<string, { color: 'default' | 'error' | 'warning' | 'success' | 'info', label: string }> = {
  pending: { color: 'default', label: 'Ожидает' },
  approved: { color: 'info', label: 'Одобрено' },
  provisioned: { color: 'warning', label: 'Предоставлено' },
  ready: { color: 'success', label: 'Готово' },
  rejected: { color: 'error', label: 'Отклонено' },
};

const RequestListItem: React.FC<RequestListItemProps> = ({ request }) => {
  const statusConfig = statusColors[request.status] || statusColors.pending;

  return (
    <TableRow hover>
      <TableCell>{request.id}</TableCell>
      <TableCell>{request.resource}</TableCell>
      <TableCell>{request.justification.substring(0, 50)}...</TableCell>
      <TableCell>
        <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
      </TableCell>
      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>{request.expirationDate ? new Date(request.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
    </TableRow>
  );
};

export default RequestListItem;

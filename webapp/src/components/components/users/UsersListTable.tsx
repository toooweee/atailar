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
import UsersListItem from './UsersListItem.tsx';
import type { UserInfo } from '../../../api/users/types/response/UserInfo.ts';

interface UsersListTableProps {
  users: UserInfo[];
}

const UsersListTable: React.FC<UsersListTableProps> = ({ users }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Пользователи">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Полное имя</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UsersListItem key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersListTable;
